
-- Create motoristas table
CREATE TABLE public.motoristas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  cnh TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.motoristas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read motoristas" ON public.motoristas FOR SELECT USING (true);
CREATE POLICY "Allow public insert motoristas" ON public.motoristas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update motoristas" ON public.motoristas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete motoristas" ON public.motoristas FOR DELETE USING (true);

CREATE TRIGGER update_motoristas_updated_at
  BEFORE UPDATE ON public.motoristas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create veiculos table
CREATE TABLE public.veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  placa TEXT NOT NULL UNIQUE,
  modelo TEXT NOT NULL,
  marca TEXT NOT NULL,
  ano INTEGER,
  tipo TEXT NOT NULL DEFAULT 'caminhao' CHECK (tipo IN ('caminhao', 'carreta', 'bitrem', 'van', 'outro')),
  capacidade_kg NUMERIC(10, 2),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read veiculos" ON public.veiculos FOR SELECT USING (true);
CREATE POLICY "Allow public insert veiculos" ON public.veiculos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update veiculos" ON public.veiculos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete veiculos" ON public.veiculos FOR DELETE USING (true);

CREATE TRIGGER update_veiculos_updated_at
  BEFORE UPDATE ON public.veiculos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create viagens table
CREATE TABLE public.viagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  motorista_id UUID REFERENCES public.motoristas(id) ON DELETE SET NULL,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  origem TEXT,
  destino TEXT,
  status TEXT NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'em_transito', 'concluida', 'atrasada', 'cancelada')),
  frete NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pedagio NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ciot_status TEXT NOT NULL DEFAULT 'pendente' CHECK (ciot_status IN ('pendente', 'emitido', 'encerrado', 'cancelado')),
  ciot_protocolo TEXT,
  data_saida TIMESTAMP WITH TIME ZONE,
  data_chegada TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.viagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read viagens" ON public.viagens FOR SELECT USING (true);
CREATE POLICY "Allow public insert viagens" ON public.viagens FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update viagens" ON public.viagens FOR UPDATE USING (true);
CREATE POLICY "Allow public delete viagens" ON public.viagens FOR DELETE USING (true);

CREATE TRIGGER update_viagens_updated_at
  BEFORE UPDATE ON public.viagens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed motoristas
INSERT INTO public.motoristas (id, nome, cpf, cnh, telefone) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'João Silva', '123.456.789-00', '12345678900', '(11) 99999-0001'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Maria Santos', '234.567.890-11', '23456789011', '(41) 99999-0002'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Carlos Oliveira', '345.678.901-22', '34567890122', '(31) 99999-0003'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Ana Pereira', '456.789.012-33', '45678901233', '(51) 99999-0004'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Pedro Costa', '567.890.123-44', '56789012344', '(81) 99999-0005');

-- Seed veiculos
INSERT INTO public.veiculos (id, placa, modelo, marca, ano, tipo, capacidade_kg) VALUES
  ('b1b2c3d4-0001-4000-8000-000000000001', 'ABC-1D34', 'FH 540', 'Volvo', 2023, 'caminhao', 23000),
  ('b1b2c3d4-0002-4000-8000-000000000002', 'DEF-5G78', 'Actros 2651', 'Mercedes-Benz', 2022, 'carreta', 32000),
  ('b1b2c3d4-0003-4000-8000-000000000003', 'GHI-9J01', 'R 450', 'Scania', 2024, 'bitrem', 57000),
  ('b1b2c3d4-0004-4000-8000-000000000004', 'JKL-2M34', 'Constellation 24.280', 'Volkswagen', 2021, 'caminhao', 16000),
  ('b1b2c3d4-0005-4000-8000-000000000005', 'MNO-5P67', 'Daily 35S14', 'Iveco', 2023, 'van', 3500);

-- Seed viagens
INSERT INTO public.viagens (codigo, motorista_id, veiculo_id, origem, destino, status, frete, pedagio, ciot_status, ciot_protocolo, data_saida) VALUES
  ('VG-001', 'a1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'em_transito', 3450.00, 280.00, 'emitido', 'CIOT-2026-00001', '2026-04-10T08:00:00Z'),
  ('VG-002', 'a1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0002-4000-8000-000000000002', 'Curitiba, PR', 'Florianópolis, SC', 'concluida', 2100.00, 150.00, 'encerrado', 'CIOT-2026-00002', '2026-04-05T06:00:00Z'),
  ('VG-003', 'a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0003-4000-8000-000000000003', 'Belo Horizonte, MG', 'Salvador, BA', 'atrasada', 5200.00, 420.00, 'emitido', 'CIOT-2026-00003', '2026-04-07T07:00:00Z'),
  ('VG-004', 'a1b2c3d4-0004-4000-8000-000000000004', 'b1b2c3d4-0004-4000-8000-000000000004', 'Porto Alegre, RS', 'São Paulo, SP', 'agendada', 4800.00, 350.00, 'pendente', NULL, NULL),
  ('VG-005', 'a1b2c3d4-0005-4000-8000-000000000005', 'b1b2c3d4-0005-4000-8000-000000000005', 'Recife, PE', 'Fortaleza, CE', 'concluida', 1800.00, 120.00, 'encerrado', 'CIOT-2026-00005', '2026-04-01T05:00:00Z');

-- Drop old table
DROP TABLE IF EXISTS public.transport_operations;
