// app.config.ts
import 'dotenv/config';
export default {
  expo: {
    name: "HABIT-TRACKER",
    slug: "habit-tracker",
    scheme: "habitsapp",
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
};