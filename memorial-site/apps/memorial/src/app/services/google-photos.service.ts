import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface PhotoItem {
  id: string;
  baseUrl: string;
  filename: string;
  description?: string;
  mediaMetadata?: { creationTime?: string };
}

interface MediaSearchResponse {
  mediaItems?: PhotoItem[];
  nextPageToken?: string;
}

@Injectable()
export class GooglePhotosService {
  private readonly baseUrl = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';

  constructor(private http: HttpClient) {}

  async fetchAlbumPhotos(apiKey: string, albumId: string): Promise<PhotoItem[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { albumId, pageSize: 25 }; // modest default to keep the page fast
    const url = `${this.baseUrl}?key=${encodeURIComponent(apiKey)}`;

    try {
      const response = await this.http
        .post<MediaSearchResponse>(url, body, { headers })
        .toPromise();
      return response?.mediaItems ?? [];
    } catch (error) {
      console.error('Unable to load Google Photos album', error);
      return [];
    }
  }
}
