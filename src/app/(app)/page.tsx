'use client'
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import message from '@/message.json'
import Navbar from '@/components/Navbar';

function Home(){


  return(
    <>
  <Navbar/>
   <main className='flex-grow flex flex-col items-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Dive in to the Anonimas messages world</h1>
        <p className='text-xl font-semibold'>Explore you True message feed - were do you how people think about you</p>
      </section>
      <Carousel 
      plugins={[Autoplay({delay:2000})]}
      className="w-full max-w-xs h-1/2">
      <CarouselContent>
        {
          message.map((message,index)=>(
            <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader className='text-center text-semibold text-xl'>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-4">
                  <span className="text-2xl font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
   </main>
   </>
    )
}

export default Home;