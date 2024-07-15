import { NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({
    apiKey: process.env["TOGETHER_API_KEY"],
  });

console.log(process.env["TOGETHER_API_KEY"]);
  
export async function GET(req, res){
    const response = await together.chat.completions.create({
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages: [
          { role: "user", content: "What are some fun things to do in New York?" },
          { role: "assistant", content: "You could go to the Empire State Building!"},
          { role: "user", content: "That sounds fun! Where is it?" },
          {role: "assistant", content: 
            "The Empire State Building is located in Midtown Manhattan, in the heart of New York City. It's one of the most iconic landmarks in the world, and it's a must-visit attraction when you're in NYC.\n\nYou can take the elevator to the observation deck on the 86th floor, which offers breathtaking views of the city and beyond. On a clear day, you can see for miles in every direction, taking in the sights of the Hudson River, Central Park, and the towering skyscrapers of Manhattan.\n\nBut the Empire State Building is just the beginning. New York City has endless options for fun and adventure. Here are a few more ideas:\n\n1. Visit the Statue of Liberty and Ellis Island: Take a ferry to Liberty Island to see the iconic Statue of Liberty up close, and visit the Ellis Island Immigration Museum to learn about the history of immigration in the United States.\n2. Explore Central Park: This 843-acre green oasis in the middle of Manhattan offers walking paths, lakes, gardens, and plenty of picnic spots. You can also rent a bike or take a horse-drawn carriage ride through the park.\n3. See a Broadway show: New York City is home to some of the world's most famous theaters, and you can catch a performance of a hit musical or play on Broadway.\n4. Visit the Metropolitan Museum of Art: The Met is one of the world's largest and most famous museums, with a collection that spans over 5,000 years of human history.\n5. Take a food tour: New York City is a food lover's paradise, with a diverse range of cuisines and restaurants to choose from. You can take a guided food tour to sample some of the city's best eats.\n6. Visit the 9/11 Memorial & Museum: This poignant tribute to the victims of the 9/11 attacks features two massive reflecting pools surrounded by the names of those who were killed, as well as a museum with artifacts and stories from that day.\n7. Go shopping: New York City is a shopper's dream, with everything from high-end designer boutiques to vintage shops and street markets. You can also visit iconic department stores like Macy's and Bloomingdale's.\n8. Take a stroll across the Brooklyn Bridge: This iconic bridge offers stunning views of the Manhattan skyline and the East River, and it's a great way to see the city from a different perspective.\n9. Visit the American Museum of Natural History: This world-renowned museum features exhibits on dinosaurs, space, and much more, as well as a giant blue whale and a giant T-Rex skeleton.\n10. Go to a TV show taping: New York City is home to many TV shows, and you can attend a live taping of a show like Saturday Night Live, The Tonight Show, or Good Morning America.\n\nThese are just a few of the many fun things to do in New York City. Whether you're interested in history, art, food, or entertainment, there's something for everyone in the city that never sleeps!"},
          { role: "user", content: "what was my first question?" },
        ],
      });
      
      return NextResponse.json(response.choices[0].message.content); 
}