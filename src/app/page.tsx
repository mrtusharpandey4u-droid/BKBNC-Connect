
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
  BadgeDollarSign,
  Users,
  Send,
  Loader2,
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
  },
  {
    value: 'financial-aid',
    label: 'How can I apply for financial aid?',
    icon: BadgeDollarSign,
  },
  {
    value: 'student-life',
    label: 'Tell me about student life and clubs.',
    icon: Users,
  },
];

function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: 'Welcome to BKBNC Connect! How can I help you today? Ask me anything about B. K. Birla Night College Kalyan, or select a predefined question.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null); // Ref for the viewport


  const scrollToBottom = () => {
    // Use the viewport ref directly if available
    const viewport = viewportRef.current;
    if (viewport) {
      // Use requestAnimationFrame to ensure scrolling happens after layout updates
      requestAnimationFrame(() => {
        viewport.scrollTop = viewport.scrollHeight;
      });
    } else if (scrollAreaRef.current) { // Fallback to querying if viewport ref isn't set yet
        const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableViewport) {
             requestAnimationFrame(() => {
                scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
             });
        }
    }
  };

  useEffect(() => {
    // Attach the ref to the viewport element after the component mounts
    if (scrollAreaRef.current) {
      const viewportElement = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewportElement) {
         // @ts-ignore - Assigning ref dynamically
        viewportRef.current = viewportElement as HTMLDivElement;
      }
    }
    scrollToBottom();
  }, [messages]); // Rerun effect when messages change


  const handlePredefinedQuestionSelect = (value: string) => {
    const selectedQuestion = predefinedQuestions.find(
      (q) => q.value === value
    );
    if (selectedQuestion) {
      handleSubmit(selectedQuestion.label);
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
    // Immediately add user message
    setMessages((prevMessages) => [
        ...prevMessages,
        { id: userMessageId, sender: 'user', text: userQuestion },
    ]);
    setInputValue('');
    setIsLoading(true);
    // Ensure scroll happens *after* state update is rendered
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
           // Ensure scroll happens *after* AI response is rendered and loading state is false
           requestAnimationFrame(scrollToBottom);
        }
    });
  };


  return (
    // Changed: Use h-screen, flex-col, remove items-center/justify-center
    <div className="flex h-screen flex-col p-4 bg-background">
       {/* Added: Wrapper div for centering card horizontally and allowing vertical stretch */}
      <div className="flex flex-1 justify-center items-stretch py-4">
          {/* Changed: Added flex, flex-col, flex-1, overflow-hidden */}
          <Card className="w-full max-w-2xl shadow-lg rounded-lg flex flex-col overflow-hidden">
            <CardHeader className="text-center pb-4 border-b bg-primary text-primary-foreground"> {/* Added bg-primary and text-primary-foreground */}
              <CardTitle className="text-2xl font-semibold text-primary-foreground"> {/* Changed text-primary to text-primary-foreground */}
                BKBNC Connect
              </CardTitle>
              <p className="text-sm text-primary-foreground opacity-90"> {/* Changed text-muted-foreground to text-primary-foreground and added opacity for subtlety */}
                B. K. Birla Night College Kalyan - Simplifying Your College Journey
              </p>
            </CardHeader>
            {/* Changed: Added flex-1, overflow-hidden */}
            <CardContent className="p-0 flex-1 overflow-hidden">
              {/* Changed: Changed h-[50vh] to h-full */}
              <ScrollArea className="h-full w-full" ref={scrollAreaRef}> {/* Removed border-t/b (now on header/footer) */}
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://scontent.fbom26-2.fna.fbcdn.net/v/t39.30808-1/309894515_391607699846414_3486837502365611657_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=S9UMlr9JFv0Q7kNvwFS2V8l&_nc_oc=AdljX0Sr6o7ncCQz1ZSw_7qUqXQz63TCzL2IAV3CF2PJrfKMEfOt0jPdwYEebEs6Drk&_nc_zt=24&_nc_ht=scontent.fbom26-2.fna&_nc_gid=pPCIynDh6wHaLXkyHflzkA&oh=00_AfIwejgoWYIBuRto8PZ0eSu42ZYHAr9oC4cYaSZKOVYI3A&oe=681FA8C8"
                            alt="AI Avatar"
                            data-ai-hint="robot assistant"
                          />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[75%] text-sm shadow-md break-words ${ // Added break-words
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-card-foreground border'
                        }`}
                      >
                        {message.text}
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://picsum.photos/41/41" // Different from AI avatar
                            alt="User Avatar"
                             data-ai-hint="person student"
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                   {isLoading && (
                     <div className="flex items-start gap-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage
                           src="https://scontent.fbom26-2.fna.fbcdn.net/v/t39.30808-1/309894515_391607699846414_3486837502365611657_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=S9UMlr9JFv0Q7kNvwFS2V8l&_nc_oc=AdljX0Sr6o7ncCQz1ZSw_7qUqXQz63TCzL2IAV3CF2PJrfKMEfOt0jPdwYEebEs6Drk&_nc_zt=24&_nc_ht=scontent.fbom26-2.fna&_nc_gid=pPCIynDh6wHaLXkyHflzkA&oh=00_AfIwejgoWYIBuRto8PZ0eSu42ZYHAr9oC4cYaSZKOVYI3A&oe=681FA8C8"
                           alt="AI Avatar"
                           data-ai-hint="robot assistant"
                         />
                         <AvatarFallback>AI</AvatarFallback>
                       </Avatar>
                       <div className="rounded-lg p-3 bg-card text-card-foreground border shadow-md flex items-center space-x-2">
                         <Loader2 className="h-4 w-4 animate-spin text-primary" />
                         <span className="text-sm">Thinking...</span>
                       </div>
                     </div>
                   )}
                </div>
              </ScrollArea>
            </CardContent>
            {/* Changed: Added border-t */}
            <CardFooter className="p-4 flex flex-col items-start gap-4 border-t">
              <div className="w-full">
                <Label htmlFor="predefined-questions" className="mb-2 block text-sm font-medium text-foreground">
                  Or select a question:
                </Label>
                 <Suspense fallback={<Skeleton className="h-10 w-full rounded-md" />}>
                     <Select onValueChange={handlePredefinedQuestionSelect} disabled={isLoading}>
                         <SelectTrigger id="predefined-questions" className="w-full rounded-md shadow-sm">
                            <SelectValue placeholder="Select a predefined question..." />
                         </SelectTrigger>
                         <SelectContent>
                             {predefinedQuestions.map((q) => (
                                <SelectItem key={q.value} value={q.value}>
                                     <div className="flex items-center gap-2">
                                        <q.icon className="h-4 w-4 text-primary" />
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
                className="flex w-full items-center gap-2"
              >
                <Input
                  id="message"
                  placeholder="Type your question here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 rounded-md shadow-sm"
                  autoComplete="off"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="rounded-md shadow-sm">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
      </div>
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
    // Changed: Use h-screen, flex-col, remove items-center/justify-center
    <div className="flex h-screen flex-col p-4 bg-background">
       {/* Added: Wrapper div for centering card horizontally and allowing vertical stretch */}
       <div className="flex flex-1 justify-center items-stretch py-4">
          {/* Changed: Added flex, flex-col, flex-1, overflow-hidden */}
          <Card className="w-full max-w-2xl shadow-lg rounded-lg flex flex-col overflow-hidden">
            <CardHeader className="text-center pb-4 border-b bg-primary text-primary-foreground"> {/* Added bg-primary and text-primary-foreground for skeleton consistency */}
                <Skeleton className="h-8 w-3/4 mx-auto mb-2 rounded-md bg-primary-foreground/20" /> {/* Adjusted skeleton color for visibility on primary bg */}
                <Skeleton className="h-4 w-1/2 mx-auto rounded-md bg-primary-foreground/20" /> {/* Adjusted skeleton color */}
            </CardHeader>
            {/* Changed: Added flex-1, overflow-hidden */}
            <CardContent className="p-0 flex-1 overflow-hidden">
              {/* Changed: Changed h-[50vh] to h-full */}
              <ScrollArea className="h-full w-full"> {/* Removed border-t/b */}
               <div className="p-4 space-y-4">
                  {/* Skeleton for AI message */}
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-16 w-3/4 rounded-lg" />
                  </div>
                  {/* Skeleton for User message */}
                  <div className="flex items-start gap-3 justify-end">
                    <Skeleton className="h-10 w-1/2 rounded-lg" />
                     <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                   <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-12 w-2/3 rounded-lg" />
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
             {/* Changed: Added border-t */}
            <CardFooter className="p-4 flex flex-col items-start gap-4 border-t">
               <div className="w-full space-y-2">
                 <Skeleton className="h-4 w-1/4 rounded-md" />
                 <Skeleton className="h-10 w-full rounded-md" />
               </div>
               <div className="flex w-full items-center gap-2">
                 <Skeleton className="h-10 flex-1 rounded-md" />
                 <Skeleton className="h-10 w-10 rounded-md" />
               </div>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}

