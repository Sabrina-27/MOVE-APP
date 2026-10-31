import { db } from '../data/store.js';
import { Article } from '../../src/types/index.js';

export class ArticleService {
  static getArticles(): Article[] {
    return db.getArticles();
  }

  static searchArticles(query: string): Article[] {
    return db.searchArticles(query);
  }

  static getArticleById(id: string): Article | undefined {
    return db.getArticles().find(a => a.id === id);
  }

  static getArticlesByCategory(category: string): Article[] {
    return db.getArticles().filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
}
