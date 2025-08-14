import { useEffect } from 'react';

declare global {
  interface Window {
    ym: (id: number, method: string, options?: any) => void;
  }
}

export const YandexMetrika = () => {
  useEffect(() => {
    // Проверяем, не загружен ли уже скрипт
    const existingScript = document.querySelector('script[src*="mc.yandex.ru"]');
    if (existingScript) return;

    // Создаем и добавляем скрипт Yandex.Metrika
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103671291', 'ym');

      ym(103671291, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
    `;
    
    document.head.appendChild(script);

    // Добавляем noscript для пользователей без JavaScript
    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/103671291" style="position:absolute; left:-9999px;" alt="" /></div>';
    document.body.appendChild(noscript);

    return () => {
      // Очистка при размонтировании
      const scripts = document.querySelectorAll('script[src*="mc.yandex.ru"]');
      scripts.forEach(s => s.remove());
      const noscripts = document.querySelectorAll('noscript');
      noscripts.forEach(n => {
        if (n.innerHTML.includes('mc.yandex.ru')) {
          n.remove();
        }
      });
    };
  }, []);

  return null;
};