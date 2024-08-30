import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { someData } = await req.json();

    const { data, error } = await supabase.from('goals').insert(someData).select();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { status: 500 }
    );
  }
};
