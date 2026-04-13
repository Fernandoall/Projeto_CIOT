
CREATE TABLE public.transport_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_code TEXT NOT NULL,
  motorista TEXT NOT NULL,
  placa TEXT NOT NULL,
  origem TEXT,
  destino TEXT,
  status TEXT NOT NULL DEFAULT 'agendada' CHECK (status IN ('em_transito', 'concluida', 'atrasada', 'agendada')),
  frete NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pedagio NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transport_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.transport_operations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.transport_operations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.transport_operations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.transport_operations FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_transport_operations_updated_at
  BEFORE UPDATE ON public.transport_operations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.transport_operations (operation_code, motorista, placa, origem, destino, status, frete, pedagio) VALUES
  ('OP-001', 'João Silva', 'ABC-1D34', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'em_transito', 3450.00, 280.00),
  ('OP-002', 'Maria Santos', 'DEF-5G78', 'Curitiba, PR', 'Florianópolis, SC', 'concluida', 2100.00, 150.00),
  ('OP-003', 'Carlos Oliveira', 'GHI-9J01', 'Belo Horizonte, MG', 'Salvador, BA', 'atrasada', 5200.00, 420.00),
  ('OP-004', 'Ana Pereira', 'JKL-2M34', 'Porto Alegre, RS', 'São Paulo, SP', 'agendada', 4800.00, 350.00),
  ('OP-005', 'Pedro Costa', 'MNO-5P67', 'Recife, PE', 'Fortaleza, CE', 'concluida', 1800.00, 120.00);
