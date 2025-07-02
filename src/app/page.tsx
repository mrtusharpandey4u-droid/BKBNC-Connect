
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
  BookOpen,
  Award,
  MapPin,
  LinkIcon,
  Contact,
  CodeXml,
  Clock10Icon,
  Clock11Icon,
} from 'lucide-react';
import { answerStudentQuestion } from '@/ai/flows/answer-student-question';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';


interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const predefinedQuestions = [
  {
    value: 'Timings',
    label: 'What Are The College Timings ?',
    icon: Clock10Icon,
    response: "The Working Hours of B. K. Birla Night College Kalyan is: 4:00 pm to 8:00 pm "
  },
  {
    value: 'Inquiry Admission',
    label: 'What Are The Inquiry Timings For The College ?',
    icon: Clock11Icon,
    response: "The Inquiry Hours of B. K. Birla Night College Kalyan is: 1:00 pm to 5:00 pm"
  },
  {
    value: 'admission-requirements',
    label: 'What is the admission process ?',
    icon: GraduationCap,
    response: `**Admission Process**
Refer this PDF: https://drive.google.com/file/d/1Ar_T5af0H69cmLxIM0asxcAKn5Vevzcp/view?usp=sharing`
  },
  {
    value: 'document-required',
    label: 'Documents Required for admission Processes.',
    icon: Users,
    response: `**Document Submission:**
After registration, students must upload scanned copies of required documents such as:

- SSC and HSC mark sheets
- School/College Leaving Certificate
- Caste certificate (if applicable)
- Aadhar card and passport-size photograph
- Gap certificate (if required)

**Merit List & Counseling:**
Admissions are based on merit. Once the merit list is announced, shortlisted students are invited for counseling sessions where they can select their preferred course and complete the admission process.`
  },
  {
    value: 'admission-link',
    label: 'How I can start my admission processes online?',
    icon: LinkIcon,
    response: "You can start your admission processes online, while refering this link: https://youtu.be/mHH2YKNuihw\nand refer PDF: https://pdf.ac/2SpmH1"
  },
  {
    value: 'pre-admission-profile-creation',
    label: 'How to fill up the Pre-Admission form - Creating Profile / Registration',
    icon: LinkIcon,
    response:"You can create your profile in Pre-Admission form,while referring the following link:https://youtu.be/aSUsW8zGwrk"
  },
  {
    value: 'Check-link',
    label: 'How to create ABC ID/Apaar ID?',
    icon: LinkIcon,
    response:"To create your ABC ID Refer this link: https://youtu.be/C5uZf8sG9HU & To fill The Form: https://www.abc.gov.in/, To print the ABC ID Follow this link: https://youtu.be/8Wac3jIjnAs"
  },
  {
    value: 'programme-selection-first-year',
    label: 'How To Select Programme for First Year Admission?',
    icon: LinkIcon,
    response: "You can select your programme, while refering this link: https://youtu.be/t-I-oBTf0vc?si=Fl-Fsh-urTxFG3gG"
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
    icon: CodeXml,
    response: "The College Code for B. K. Birla Night College Kalyan is 840.",
  },
  {
    value: 'programme-offered',
    label: 'Programme Offered by the College?',
    icon: BookOpen,
    response: `1. B.A. (3180161)
2. B.Sc. (1150161)
3. B.Com. (2126161)
4. B.Com. (Management Studies) (2126561)
5. B.Com. (Accounting & Finance) (2126261)
6. B.Com. (Financial Markets) (2126361)
7. B.Sc. (Computer Science) (1151061)`
  },
  {
    value: 'College-location',
    label: 'Where B. K. Birla Night College is Located?',
    icon: MapPin,
    response: `**Here is the Google Map location of B. K. Birla Night College, Kalyan:**
🔗B.K. Birla Night College on Google Maps: https://shorturl.at/vKzDC
📍 **Address on Map:**
B.K. Birla College of Arts, Science & Commerce,
Birla College Road, Kalyan West,
Maharashtra 421301, India`
  },
  {
    value: 'Offical-page',
    label: 'Offical Connects',
    icon: Contact,
    response: `**Offical Website:**
https://bkbirlanightcollegekalyan.com/

**Instagram:**
https://www.instagram.com/bkbirlanightcollege_kalyan/

**Facebook:**
https://www.facebook.com/BKBirlaNightCollegeKalyan

**YouTube:**
https://www.youtube.com/@B.K.BIRLANIGHTCOLLEGEKALYAN`
  },
  {
    value: 'student-life',
    label: 'Tell me about student life and clubs.',
    icon: Users,
    response: "Life at our college is vibrant, enriching, and thoughtfully designed to support every student's growth, especially working students who benefit from convenient class timings. With a faculty that's not just qualified but deeply committed, students receive quality education in a secure, inclusive environment. The campus buzzes with energy—from well-equipped science labs that spark innovation, to active participation in state and national-level platforms like Aavishkar, Ideathon (Mumbai), RT-MSSU Ideation, and SBI Youth Ideation. Beyond academics, students engage in a dynamic mix of co-curricular and extracurricular activities including Sports, NCC, NSS, and cultural fests, shaping holistic development. The college also offers scholarships through management, easing financial burdens for many. A strong Training and Placement Cell prepares students for the real world, while the Mpower Cell provides personal counseling to ensure mental well-being. Altogether, student life here is a balanced blend of learning, leadership, and lifelong memories."
  },
  {
    value: 'Achievements',
    label: 'College Achievements',
    icon: Award,
    response: `**SBI COLLEGE YOUTH IDEATION 2024**

Mr. Vansh Shah, Mr. Sachin Verma, and Mr. Vikram Chaudhari from FYBFM, B.K. Birla Night College, Kalyan, secured a spot among the Top 100 teams out of 45,000 at IIT Delhi. Their innovative project focuses on digitalizing ambulance services, insurance, and hospital bed management.This national-level achievement highlights their potential to revolutionize emergency healthcare in India.

(See more on Instagram: https://www.instagram.com/p/DITyZeTKi8Z/?img_index=1)

**Sports Achivement: South Asian Triathlon Championship**

Ms. Dolly Devidas Patil of FYBCom, B.K. Birla Night College, Kalyan, has brought immense pride to the institution by winning the Gold Medal at the South Asian Triathlon Championship held in Nepal on 25th and 26th April 2024. Her outstanding performance at this prestigious international event showcases her unwavering dedication, athletic excellence, and commitment to representing both her college and country with honor. This remarkable accomplishment stands as an inspiration to all aspiring athletes and a proud moment for the entire BKBNC family.

(See more on Instagram: https://www.instagram.com/p/DI_YVk4hQia/)

**Secured the second prize at the national level RT MSSU Ideation Competition 2.0**

Ms. Sakshi Parekh, a Third-Year B.Sc. student at B.K. Birla Night College, Kalyan, secured the second prize at the national-level RT-MSSU Ideation Competition 2.0 for her project “Vishw Aadhar Bio Cement and Fertilizer.” Her idea, focused on converting organic waste into bio-cement and organic fertilizer, was recognized for its innovation, sustainability, and practical utility. Chosen from thousands of entries nationwide, her project earned her a cash prize of ₹2 lakhs and highlighted the college emphasis on research-driven and socially impactful education.

(See more on Instagram: https://www.instagram.com/bkbirlanightcollege_kalyan/p/DI_Yl2ohZww/)

**The Entrepreneurship Cell of B.K. Birla Night College successfully organized the Startup Mela**

an initiative to promote student innovation and entrepreneurship. Held under the guidance of Principal Dr. Bipinchandra Wadekar, the event featured diverse student-led stalls showcasing unique products and ideas. Dr. Rupesh Patil, along with faculty support, coordinated the event effectively. Dharani Mudaliar and Darshan Dubey served as event coordinators, while Atharva Jadhav and Laxmi Singh handled social media outreach. The event generated a total turnover of ₹9,810, providing students with a valuable platform to display their creativity and entrepreneurial potential.

(See more on Instagram: https://www.instagram.com/p/DBB7oAKKWx_/)`
  },
];

// Helper function to render text with clickable links and bolding
const renderTextWithLinks = (text: string) => {
  const elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  // Regex to find URLs or bold text
  const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\*\*[^*]+\*\*)/ig;

  if (typeof text !== 'string') {
    return [text];
  }

  let match;
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const matchedText = match[0];

    if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      // Handle bold text
      elements.push(
        <strong key={`${matchedText}-${match.index}`}>
          {matchedText.substring(2, matchedText.length - 2)}
        </strong>
      );
    } else if (matchedText.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig)) {
      // Handle URL
      let href = matchedText;
      if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('ftp://') && !href.startsWith('file://')) {
        if (href.startsWith('www.')) {
          href = 'https://' + href;
        } else if (href.includes('.')) { // Basic check if it looks like a domain
          href = 'https://' + href;
        }
      }
      elements.push(
        <a
          key={`${href}-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-foreground underline hover:text-accent-foreground/80 transition-colors"
        >
          {matchedText}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.filter(part => part !== '');
};


function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const initialAiMessageId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2);

    setMessages([
      {
        id: initialAiMessageId,
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
    if (scrollAreaRef.current && !viewportRef.current) {
      const viewportElement = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewportElement) {
        viewportRef.current = viewportElement as HTMLDivElement;
      }
    }
    scrollToBottom();
  }, [messages]);

  if (!isMounted) {
    return <LoadingSkeleton />;
  }

  const handlePredefinedQuestionSelect = (value: string) => {
    const selectedQuestion = predefinedQuestions.find(
      (q) => q.value === value
    );
    if (selectedQuestion) {
        const userMessageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        if (selectedQuestion.response) {
            const aiMessageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
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

    const userMessageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
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
          const aiMessageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: aiMessageId, sender: 'ai', text: response.answer },
          ]);
        } catch (error) {
          const errorAiMessageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: errorAiMessageId,
              sender: 'ai',
              text: 'Kindly Contact College For Further Assitance.',
            },
          ]);
        } finally {
          setIsLoading(false);
           requestAnimationFrame(scrollToBottom);
        }
    });
  };


  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-2 sm:p-4 bg-background text-foreground">
      <Card className="w-full max-w-4xl shadow-2xl rounded-xl flex flex-col overflow-hidden h-full animate-in fade-in zoom-in-95 duration-500 ease-out bg-card backdrop-blur-sm border-primary/20">
        <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b border-primary/20 bg-primary text-primary-foreground">
          <Avatar className="h-12 w-12 border-2 border-primary-foreground/50 rounded-full shadow-md">
            <AvatarImage
              src="https://bkbirlanightcollegekalyan.com/img/logo.png"
              alt="BKBNC Logo"
              data-ai-hint="college logo"
            />
            <AvatarFallback className="bg-primary-foreground/20 text-primary font-semibold">BNC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-xl font-semibold text-primary-foreground">
               B. K. Birla Night College, Kalyan
            </CardTitle>
            <p className="text-sm text-primary-foreground/90">
              BKBNC Connect - Simplifying Your College Journey
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden bg-background/80">
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in fade-in-90 slide-in-from-bottom-6 duration-300 ease-out`}
                >
                  <div
                    className={`rounded-xl p-3 max-w-[85%] text-sm shadow-lg break-words whitespace-pre-wrap text-justify
                      ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-muted-foreground border border-border rounded-bl-none'
                      }`}
                  >
                    {renderTextWithLinks(message.text)}
                  </div>
                </div>
              ))}
               {isLoading && (
                 <div className="flex items-end gap-3 justify-start animate-in fade-in duration-300">
                   <div className="rounded-xl p-3 bg-muted text-muted-foreground border border-border shadow-lg flex items-center space-x-2 rounded-bl-none">
                     <Loader2 className="h-5 w-5 animate-spin text-accent-foreground" />
                     <span className="text-sm">Thinking...</span>
                   </div>
                 </div>
               )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 flex flex-col items-start gap-4 border-t border-primary/20 bg-primary">
          <div className="w-full">
             <Suspense fallback={<Skeleton className="h-10 w-full rounded-lg bg-primary-foreground/20" />}>
                 <Select onValueChange={handlePredefinedQuestionSelect} disabled={isLoading} >
                     <SelectTrigger
                        id="predefined-questions"
                        className="w-full rounded-lg shadow-md bg-card text-card-foreground focus:ring-ring focus:border-ring"
                        suppressHydrationWarning={true}
                     >
                        <SelectValue placeholder="Select a predefined question..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-lg shadow-lg bg-card text-card-foreground border-border">
                         {predefinedQuestions.map((q) => (
                            <SelectItem key={q.value} value={q.value} className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
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
              className="flex-1 rounded-lg shadow-md bg-card text-card-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring"
              autoComplete="off"
              disabled={isLoading}
              suppressHydrationWarning={true}
            />
            <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="rounded-lg shadow-md h-10 w-10 active:scale-95 transform transition-transform duration-100 ease-in-out bg-accent text-accent-foreground hover:bg-accent/90"
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
    <div className="flex h-screen w-screen flex-col items-center justify-center p-2 sm:p-4 bg-background text-foreground animate-in fade-in duration-300">
       <Card className="w-full max-w-4xl shadow-2xl rounded-xl flex flex-col overflow-hidden h-full bg-card backdrop-blur-sm border-primary/20">
         <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b border-primary/20 bg-primary text-primary-foreground">
             <Skeleton className="h-12 w-12 rounded-full bg-primary-foreground/30" />
             <div className="flex flex-col space-y-1.5">
                 <Skeleton className="h-6 w-72 rounded-md bg-primary-foreground/30" />
                 <Skeleton className="h-4 w-48 rounded-md bg-primary-foreground/30" />
             </div>
         </CardHeader>
         <CardContent className="p-0 flex-1 overflow-hidden bg-background/80">
           <ScrollArea className="h-full w-full">
            <div className="p-4 space-y-6">
               <div className="flex items-end gap-3 justify-start">
                 <Skeleton className="h-20 w-3/4 rounded-xl bg-muted rounded-bl-none" />
               </div>
               <div className="flex items-end gap-3 justify-end">
                 <Skeleton className="h-12 w-1/2 rounded-xl bg-primary text-primary-foreground rounded-br-none" />
               </div>
                <div className="flex items-end gap-3 justify-start">
                 <Skeleton className="h-16 w-2/3 rounded-xl bg-muted rounded-bl-none" />
               </div>
             </div>
           </ScrollArea>
         </CardContent>
         <CardFooter className="p-4 flex flex-col items-start gap-4 border-t border-primary/20 bg-primary">
            <div className="w-full">
              <Skeleton className="h-10 w-full rounded-lg bg-card" />
            </div>
            <div className="flex w-full items-center gap-3">
              <Skeleton className="h-10 flex-1 rounded-lg bg-card" />
              <Skeleton className="h-10 w-10 rounded-lg bg-accent" />
            </div>
         </CardFooter>
       </Card>
   </div>
  );
}
