
'use client';

import { useState, type FormEvent, Suspense, startTransition } from 'react';
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
      sender: 'ai',
      text: 'Welcome to BKBNC Connect! How can I help you today? Ask me anything about B. K. Birla Night College Kalyan, or select a predefined question.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

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

    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', text: userQuestion },
    ];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    startTransition(async () => {
        try {
          const response = await answerStudentQuestion({ question: userQuestion });
          setMessages([
            ...newMessages,
            { sender: 'ai', text: response.answer },
          ]);
        } catch (error) {
          console.error('Error fetching AI answer:', error);
          setMessages([
            ...newMessages,
            {
              sender: 'ai',
              text: 'Sorry, I encountered an error trying to answer your question. Please try again.',
            },
          ]);
        } finally {
          setIsLoading(false);
        }
    })
  };


  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-semibold text-primary">
            BKBNC Connect
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            B. K. Birla Night College Kalyan - Simplifying Your College Journey
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[50vh] w-full p-4 border-t border-b">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://picsum.photos/40/40"
                        alt="AI Avatar"
                        data-ai-hint="robot assistant"
                      />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[75%] text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://picsum.photos/40/40"
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
                       src="https://picsum.photos/40/40"
                       alt="AI Avatar"
                       data-ai-hint="robot assistant"
                     />
                     <AvatarFallback>AI</AvatarFallback>
                   </Avatar>
                   <div className="rounded-lg p-3 bg-secondary text-secondary-foreground flex items-center space-x-2">
                     <Loader2 className="h-4 w-4 animate-spin" />
                     <span>Thinking...</span>
                   </div>
                 </div>
               )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 flex flex-col items-start gap-4">
          <div className="w-full">
            <Label htmlFor="predefined-questions" className="mb-2 block text-sm font-medium">
              Or select a question:
            </Label>
             <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                 <Select onValueChange={handlePredefinedQuestionSelect}>
                     <SelectTrigger id="predefined-questions" className="w-full">
                        <SelectValue placeholder="Select a predefined question..." />
                     </SelectTrigger>
                     <SelectContent>
                         {predefinedQuestions.map((q) => (
                            <SelectItem key={q.value} value={q.value}>
                                 <div className="flex items-center gap-2">
                                    <q.icon className="h-4 w-4 text-muted-foreground" />
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
              className="flex-1"
              autoComplete="off"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg">
        <CardHeader className="text-center pb-4">
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[50vh] w-full p-4 border-t border-b">
            <div className="space-y-4">
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
        <CardFooter className="p-4 flex flex-col items-start gap-4">
           <div className="w-full space-y-2">
             <Skeleton className="h-4 w-1/4" />
             <Skeleton className="h-10 w-full" />
           </div>
           <div className="flex w-full items-center gap-2">
             <Skeleton className="h-10 flex-1" />
             <Skeleton className="h-10 w-10" />
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
