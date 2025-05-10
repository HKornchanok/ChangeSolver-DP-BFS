import { Injectable } from '@angular/core';

// Angular environment file
export const environment = {
  production: false,
  supabaseUrl: '${process.env["SUPABASE_URL"]}',
  supabaseKey: '${process.env["SUPABASE_ANON_KEY"]}',
};