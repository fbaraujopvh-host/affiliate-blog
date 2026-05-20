import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const rodape = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/rodape' }),
  schema: z.object({
    descricao: z.string(),
    colunas: z.array(
      z.object({
        titulo: z.string(),
        links: z.array(
          z.object({
            label: z.string(),
            href: z.string(),
          })
        ),
      })
    ),
  }),
});

const categorias = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categorias' }),
  schema: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        icon: z.string(),
        slug: z.string(),
      })
    ),
  }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/paginas' }),
  schema: z.object({
    heroBadge: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroDescription: z.string().optional(),
    heroCta1Label: z.string().optional(),
    heroCta1Url: z.string().optional(),
    heroCta2Label: z.string().optional(),
    heroCta2Url: z.string().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    image: z.string(),
    imageAlt: z.string().optional(),
    publishedAt: z.coerce.date(),
    readingTime: z.number().default(5),
    featured: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    image: z.string(),
    price: z.string(),
    oldPrice: z.string().optional(),
    rating: z.number().min(1).max(5),
    reviewCount: z.number().default(0),
    affiliateUrl: z.string(),
    badge: z.string().optional(),
    pros: z.array(z.string()).default([]),
    category: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, products, paginas, categorias, rodape };
