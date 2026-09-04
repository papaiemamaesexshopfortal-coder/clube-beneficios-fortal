import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function isValidCpf(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (value: string, length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(value[index]) * (length + 1 - index);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cpf, 9);
  const secondDigit = calculateDigit(cpf, 10);
  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = String(body.phone ?? '').trim();
    const cpf = String(body.cpf ?? '').replace(/\D/g, '');
    const terms = body.terms === 'yes';

    if (name.length < 3 || !email.includes('@') || phone.length < 8 || !isValidCpf(cpf) || !terms) {
      return NextResponse.json({ error: 'Confira os dados e aceite os termos para continuar.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('members')
      .insert({ name, email, phone, cpf, terms_accepted_at: new Date().toISOString() })
      .select('lucky_number')
      .single();

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Já existe um cadastro com este CPF ou e-mail.' }, { status: 409 });
      throw error;
    }

    return NextResponse.json({ luckyNumber: String(data.lucky_number).padStart(6, '0') });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Serviço temporariamente indisponível. Tente novamente em instantes.' }, { status: 500 });
  }
}
