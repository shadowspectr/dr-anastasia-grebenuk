-- Создание таблицы для основного контента (главное фото, блок "О нас")
CREATE TABLE public.main_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  main_photo_url TEXT NOT NULL DEFAULT '',
  about_title TEXT NOT NULL DEFAULT 'О НАС',
  about_description TEXT NOT NULL DEFAULT '',
  about_advantages TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для команды
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  photo_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание таблицы для FAQ
CREATE TABLE public.faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включение RLS для всех таблиц
ALTER TABLE public.main_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

-- Создание политик для публичного доступа
CREATE POLICY "Public access for main_content" ON public.main_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for faq" ON public.faq FOR ALL USING (true) WITH CHECK (true);

-- Вставка начальных данных
INSERT INTO public.main_content (main_photo_url, about_title, about_description, about_advantages) VALUES 
('/lovable-uploads/731c0a35-be6b-42db-8dfe-5c8ee32e6d65.png', 'О НАС', 'RESIDENCE by Alya Kim – это не просто клиника в центре города, это резиденция красивых людей и эстетического удовольствия. Здесь работают самые востребованные специалисты высшей категории, а каждая деталь интерьера создана с любовью, сочетая стиль и сильную энергетику.', 
ARRAY[
  'высококвалифицированные специалисты с медицинским образованием',
  'большой спектр различных услуг',
  'удобное расположение в самом центре Ростова-на-Дону',
  'высокий уровень сервиса',
  'безупречная репутация',
  'полное доверие более 10.000 пациентов'
]);

INSERT INTO public.team_members (name, position, description, photo_url, sort_order) VALUES 
('Dr. Anastasia Grebenuk', 'Главный врач', 'Специалист высшей категории с многолетним опытом работы', '/lovable-uploads/cd4553b0-6644-40cd-b20c-17dfe7481cc9.png', 1),
('Marina Kozlova', 'Косметолог', 'Эксперт в области эстетической медицины', '/lovable-uploads/a27874b1-e959-43d2-a635-06b486deb91d.png', 2),
('Elena Petrova', 'Массажист', 'Мастер расслабляющих и лечебных процедур', '/lovable-uploads/3e533f6e-3c39-4db5-8fc0-7afaa4aeba30.png', 3);

INSERT INTO public.faq (question, answer, sort_order) VALUES 
('Как записаться на прием?', 'Вы можете записаться через наш сайт, по телефону или в Telegram', 1),
('Какие услуги вы предоставляете?', 'Мы предлагаем широкий спектр косметологических и эстетических услуг', 2),
('Где вы находитесь?', 'Наша клиника расположена в центре Ростова-на-Дону', 3);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггеров для автоматического обновления updated_at
CREATE TRIGGER update_main_content_updated_at
  BEFORE UPDATE ON public.main_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON public.faq
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();