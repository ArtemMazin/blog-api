export const exampleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmI4Yzc1YjMzNzIzNzk0N2IxNjM2IiwiaWF0IjoxNjc4MzQ2NjM2LCJleHAiOjE2NzgzNDc2MzZ9.G1nWZeG-Wcw5qv4x637l6hZGQYpVd93WLh0_c0g4vJc';

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Средняя скорость чтения
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}
