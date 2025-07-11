-- Add VK and Telegram links to footer_links table
ALTER TABLE public.footer_links 
ADD COLUMN vkontakte text NOT NULL DEFAULT '',
ADD COLUMN telegram_channel text NOT NULL DEFAULT '';