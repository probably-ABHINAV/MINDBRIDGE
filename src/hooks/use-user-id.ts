"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "mindbridge_user_id";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if UUID exists
    let id = localStorage.getItem(USER_ID_KEY);
    
    // If not, create and save a new one
    if (!id) {
      id = uuidv4();
      localStorage.setItem(USER_ID_KEY, id);
      
      // Optionally, we could call a server action here to ensure the user exists in Postgres
      // For now, we will lazily create the user record when they first save data.
    }
    
    setUserId(id);
  }, []);

  return userId;
}
