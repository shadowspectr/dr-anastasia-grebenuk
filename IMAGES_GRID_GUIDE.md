# Размерная сетка для изображений

## Рекомендуемые размеры и пропорции для разных секций:

### 1. Команда специалистов (Team Section)
- **Формат:** Квадратные изображения 1:1
- **Рекомендуемый размер:** 400x400px минимум
- **Отображение:** 
  - Мобильные: 80x80px
  - Планшеты и десктопы: 96x96px
- **Обрезка:** object-fit: cover с центрированием
- **Особенности:** Круглые углы, хорошо работает с портретными фото

### 2. Обучение (Education Section)
- **Формат:** Широкоформатные изображения 16:9
- **Рекомендуемый размер:** 1920x1080px или 1600x900px
- **Отображение:** Адаптивный размер с сохранением пропорций
- **Обрезка:** object-fit: cover с центрированием
- **Особенности:** Карусель с плавными переходами

### 3. Работы/Галерея (Works/Gallery Section)
- **Формат:** Изображения 4:3 (альбомная ориентация)
- **Рекомендуемый размер:** 1200x900px или 800x600px
- **Отображение:**
  - Мобильные: 1 колонка
  - Планшеты: 2 колонки
  - Десктопы: 1 колонка (для детального просмотра)
- **Обрезка:** object-fit: cover с центрированием
- **Особенности:** Hover эффекты, плавные анимации

### 4. Админ панель - Фотографии обучения
- **Формат:** Изображения 4:3
- **Сетка:**
  - Мобильные: 2 колонки
  - Планшеты: 3 колонки  
  - Десктопы: 4 колонки
- **Обрезка:** object-fit: cover с центрированием

## CSS свойства для правильного отображения:

```css
/* Для всех изображений */
.image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

/* Команда специалистов */
.team-photo {
  aspect-ratio: 1/1;
  border-radius: 1rem;
}

/* Обучение */
.education-photo {
  aspect-ratio: 16/9;
  border-radius: 0.5rem;
}

/* Работы */
.works-photo {
  aspect-ratio: 4/3;
  border-radius: 1.5rem;
}
```

## Преимущества новой сетки:

1. **Консистентность** - все изображения имеют предсказуемые пропорции
2. **Отзывчивость** - адаптируется к разным размерам экрана
3. **Производительность** - оптимизированные размеры без потери качества
4. **UX** - единообразный внешний вид без обрезания важных частей изображения
5. **Accessibility** - правильное позиционирование объектов на фото

## Рекомендации для загрузки:

- Используйте изображения высокого качества
- Соблюдайте рекомендуемые пропорции
- Центрируйте важные объекты при съемке
- Сжимайте изображения для веб (JPEG 80-90% качества)