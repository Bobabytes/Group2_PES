import { useState, useEffect } from 'react'
import { Dialog, DropdownMenu, Tooltip } from "radix-ui";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );

  // // Data pulled from backend is saved here
  // const [count, setCount] = useState(0);
  // const [array, setArray] = useState([]);

  // // Base Axios usage
  // const fetchAPI = async () => {
  //   const response = await axios.get("http://localhost:8080/api");
  //   setArray(response.data.fruits);
  //   console.log(response.data.fruits);
  // }
  // // API Fetch
  // useEffect( () => {
  //   fetchAPI();
  // }, []);

  // return (
  //   <div>
  //     <h1>To-Be PES</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         CLICK HERE! Count is {count}
  //       </button>
  //       <p>
  //         Lots to do.
  //       </p>

  //       {/** Use data pulled from backend to display strings */}
  //       {
  //         array.map((fruit, index) => (
  //           <div key={index}>
  //             <p>{fruit}</p>
  //             <br></br>
  //           </div>
  //         ))
  //       }
  //     </div>
  //     <p className="read-the-docs">
  //       If you can see fruits, that means the backend is working
  //     </p>
  //   </div>
  // )
  
}

export default App
