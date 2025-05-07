
'use client';

import { useState, type FormEvent, Suspense, startTransition, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  GraduationCap,
  Users,
  Send,
  Loader2,
  Info,
  Code2,
  BookOpen,
} from 'lucide-react';
import { answerStudentQuestion } from '@/ai/flows/answer-student-question';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const predefinedQuestions = [
  {
    value: 'admission-requirements',
    label: 'What are the admission requirements?',
    icon: GraduationCap,
    response:
      'Admission Process\n' +
      'The admission process at our college is simple, transparent, and student-focused. Admissions are open to students from all backgrounds who meet the eligibility criteria as per university and government norms.\n\n' +
      'Online Registration:\n' +
      'Students must first register online through the college or university admission portal. Basic personal and academic details need to be filled out accurately.\n\n' +
      'Document Submission:\n' +
      'After registration, students must upload scanned copies of required documents such as:\n\n' +
      '- SSC and HSC mark sheets\n' +
      '- School/College Leaving Certificate\n' +
      '- Caste certificate (if applicable)\n' +
      '- Aadhar card and passport-size photograph\n' +
      '- Gap certificate (if required)\n\n' +
      'Merit List & Counseling:\n' +
      'Admissions are based on merit. Once the merit list is announced, shortlisted students are invited for counseling sessions where they can select their preferred course and complete the admission process.\n\n' +
      'Fee Payment:\n' +
      'After document verification and counseling, students can proceed with the payment of fees either online or offline at the college office.\n\n' +
      'Confirmation of Admission:\n' +
      'On successful fee payment and verification, admission is confirmed, and students receive their ID card and timetable.\n\n' +
      'Support Services:\n' +
      'For any assistance, students can contact the Admission Help Desk or use our college chatbot for instant responses to queries regarding courses, fees, scholarships, and more.',
  },
  {
    value: 'student-life',
    label: 'Tell me about student life and clubs.',
    icon: Users,
    response: "Life at our college is vibrant, enriching, and thoughtfully designed to support every student's growth, especially working students who benefit from convenient class timings. With a faculty that's not just qualified but deeply committed, students receive quality education in a secure, inclusive environment. The campus buzzes with energy—from well-equipped science labs that spark innovation, to active participation in state and national-level platforms like Aavishkar, Ideathon (Mumbai), RT-MSSU Ideation, and SBI Youth Ideation. Beyond academics, students engage in a dynamic mix of co-curricular and extracurricular activities including Sports, NCC, NSS, and cultural fests, shaping holistic development. The college also offers scholarships through management, easing financial burdens for many. A strong Training and Placement Cell prepares students for the real world, while the Mpower Cell provides personal counseling to ensure mental well-being. Altogether, student life here is a balanced blend of learning, leadership, and lifelong memories."
  },
  {
    value: 'college-profile',
    label: 'Where can I find the college profile or "About Us" information?',
    icon: Info,
    response: "You can find detailed information about the college's profile, history, vision, and mission on their official website: https://bkbirlanightcollegekalyan.com/profile.aspx"
  },
  {
    value: 'college-code',
    label: 'What is the College Code?',
    icon: Code2,
    response: "The College Code for B. K. Birla Night College Kalyan is 840.",
  },
  {
    value: 'programme-offered',
    label: 'Programme Offered by the College?',
    icon: BookOpen,
    response: "1. B.A.\n2. B.Sc.\n3. B.Com.\n4. B.Com. (Management Studies)\n5. B.Com. (Accounting & Finance)\n6. B.Com. (Financial Markets)\n7. B.Sc. (Computer Science)"
  },
];

// Helper function to render text with clickable links
const renderTextWithLinks = (text: string) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part && part.match(urlRegex)) {
      let href = part;
      if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('ftp://') && !href.startsWith('file://')) {
         if(href.startsWith('www.')) {
            href = 'https://' + href;
        } else if(href.includes('.')) { 
            href = 'https://' + href;
        }
      }
      return (
        <a
          key={`${part}-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          {part}
        </a>
      );
    }
    return part || '';
  }).filter(part => part !== '');
};


function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure this runs only on the client
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: 'Welcome to BKBNC Connect! How can I help you today? Ask me anything about B. K. Birla Night College Kalyan, or select a predefined question.',
      },
    ]);
  }, []);


  const scrollToBottom = () => {
    const viewport = viewportRef.current;
    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTop = viewport.scrollHeight;
      });
    } else if (scrollAreaRef.current) {
        const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableViewport) {
             requestAnimationFrame(() => {
                scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
             });
        }
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewportElement = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewportElement) {
        viewportRef.current = viewportElement as HTMLDivElement;
      }
    }
    scrollToBottom();
  }, [messages]);


  const handlePredefinedQuestionSelect = (value: string) => {
    const selectedQuestion = predefinedQuestions.find(
      (q) => q.value === value
    );
    if (selectedQuestion) {
        if (selectedQuestion.response) {
            const userMessageId = crypto.randomUUID();
            const aiMessageId = crypto.randomUUID();
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: userMessageId, sender: 'user', text: selectedQuestion.label },
                { id: aiMessageId, sender: 'ai', text: selectedQuestion.response },
            ]);
            requestAnimationFrame(scrollToBottom);
        } else {
            handleSubmit(selectedQuestion.label);
        }
    }
  };

  const handleSubmit = async (
    question: string | FormEvent<HTMLFormElement>
  ) => {
    let userQuestion = '';
    if (typeof question === 'string') {
      userQuestion = question;
    } else {
      question.preventDefault();
      userQuestion = inputValue;
    }

    if (!userQuestion.trim()) return;

    const userMessageId = crypto.randomUUID();
    setMessages((prevMessages) => [
        ...prevMessages,
        { id: userMessageId, sender: 'user', text: userQuestion },
    ]);
    setInputValue('');
    setIsLoading(true);
    requestAnimationFrame(scrollToBottom);


    startTransition(async () => {
        try {
          const response = await answerStudentQuestion({ question: userQuestion });
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: crypto.randomUUID(), sender: 'ai', text: response.answer },
          ]);
        } catch (error) {
          console.error('Error fetching AI answer:', error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: crypto.randomUUID(),
              sender: 'ai',
              text: 'Sorry, I encountered an error trying to answer your question. Please try again.',
            },
          ]);
        } finally {
          setIsLoading(false);
           requestAnimationFrame(scrollToBottom);
        }
    });
  };


  return (
    <div className="flex h-screen flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-2xl shadow-xl rounded-xl flex flex-col overflow-hidden h-full animate-in fade-in zoom-in-95 duration-300 ease-out">
        <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b bg-primary text-primary-foreground">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="https://scontent.fbom26-2.fna.fbcdn.net/v/t39.30808-1/309894515_391607699846414_3486837502365611657_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=S9UMlr9JFv0Q7kNvwFS2V8l&_nc_oc=AdljX0Sr6o7ncCQz1ZSw_7qUqXQz63TCzL2IAV3CF2PJrfKMEfOt0jPdwYEebEs6Drk&_nc_zt=24&_nc_ht=scontent.fbom26-2.fna&_nc_gid=pPCIynDh6wHaLXkyHflzkA&oh=00_AfIwejgoWYIBuRto8PZ0eSu42ZYHAr9oC4cYaSZKOVYI3A&oe=681FA8C8"
              alt="BKBNC Logo"
              data-ai-hint="college logo"
            />
            <AvatarFallback>BNC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-xl font-semibold text-primary-foreground">
              BKBNC Connect - Simplifying Your College Journey
            </CardTitle>
            <p className="text-sm text-primary-foreground/90">
              B. K. Birla Night College Kalyan
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in fade-in-90 slide-in-from-bottom-4 duration-300 ease-out`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[80%] text-sm shadow-md break-words whitespace-pre-wrap ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-card-foreground border'
                    }`}
                  >
                    {renderTextWithLinks(message.text)}
                  </div>
                </div>
              ))}
               {isLoading && (
                 <div className="flex items-end gap-3 justify-start animate-in fade-in duration-300">
                   <div className="rounded-lg p-3 bg-card text-card-foreground border shadow-md flex items-center space-x-2">
                     <Loader2 className="h-5 w-5 animate-spin text-primary" />
                     <span className="text-sm">Thinking...</span>
                   </div>
                 </div>
               )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 flex flex-col items-start gap-4 border-t bg-background/50">
          <div className="w-full">
            <Label htmlFor="predefined-questions" className="mb-2 block text-sm font-medium text-foreground/90">
              Or select a question:
            </Label>
             <Suspense fallback={<Skeleton className="h-10 w-full rounded-lg" />}>
                 <Select onValueChange={handlePredefinedQuestionSelect} disabled={isLoading} >
                     <SelectTrigger
                        id="predefined-questions"
                        className="w-full rounded-lg shadow-sm"
                        suppressHydrationWarning={true}
                     >
                        <SelectValue placeholder="Select a predefined question..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-lg shadow-lg">
                         {predefinedQuestions.map((q) => (
                            <SelectItem key={q.value} value={q.value} className="cursor-pointer">
                                 <div className="flex items-center gap-3">
                                    <q.icon className="h-5 w-5 text-primary" />
                                    <span>{q.label}</span>
                                 </div>
                             </SelectItem>
                         ))}
                     </SelectContent>
                 </Select>
             </Suspense>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-3"
          >
            <Input
              id="message"
              placeholder="Type your question here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-lg shadow-sm"
              autoComplete="off"
              disabled={isLoading}
            />
            <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="rounded-lg shadow-sm h-10 w-10 active:scale-95 transform transition-transform duration-100 ease-in-out"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Home() {
    return (
         <Suspense fallback={<LoadingSkeleton />}>
           <ChatInterface />
         </Suspense>
       );
}


function LoadingSkeleton() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-background to-muted animate-in fade-in duration-300">
       <Card className="w-full max-w-2xl shadow-xl rounded-xl flex flex-col overflow-hidden h-full">
         <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b bg-primary text-primary-foreground">
             <Skeleton className="h-12 w-12 rounded-full bg-primary-foreground/30" />
             <div className="flex flex-col space-y-1.5">
                 <Skeleton className="h-6 w-40 rounded-md bg-primary-foreground/30" />
                 <Skeleton className="h-4 w-56 rounded-md bg-primary-foreground/30" />
             </div>
         </CardHeader>
         <CardContent className="p-0 flex-1 overflow-hidden">
           <ScrollArea className="h-full w-full">
            <div className="p-4 space-y-4">
               <div className="flex items-end gap-3 justify-start">
                 <Skeleton className="h-20 w-3/4 rounded-lg bg-muted-foreground/20" />
               </div>
               <div className="flex items-end gap-3 justify-end">
                 <Skeleton className="h-12 w-1/2 rounded-lg bg-primary/20" />
               </div>
                <div className="flex items-end gap-3 justify-start">
                 <Skeleton className="h-16 w-2/3 rounded-lg bg-muted-foreground/20" />
               </div>
             </div>
           </ScrollArea>
         </CardContent>
         <CardFooter className="p-4 flex flex-col items-start gap-4 border-t bg-background/50">
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-1/3 rounded-md bg-muted-foreground/20" />
              <Skeleton className="h-10 w-full rounded-lg bg-muted-foreground/20" />
            </div>
            <div className="flex w-full items-center gap-3">
              <Skeleton className="h-10 flex-1 rounded-lg bg-muted-foreground/20" />
              <Skeleton className="h-10 w-10 rounded-lg bg-muted-foreground/20" />
            </div>
         </CardFooter>
       </Card>
   </div>
  );
}

