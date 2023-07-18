import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface File {
  name: string;
  path: string;
  size: number;
  extension: string;
  createdDate: string;
  permissions: string;
  isDirectory: boolean;
}

@Component({
  selector: 'app-directory-browser',
  templateUrl: './directory-browser.component.html',
  styleUrls: ['./directory-browser.component.css'],
})
export class DirectoryBrowserComponent {
  directoryPath = '';
  directoryListing: File[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  fetchDirectoryListing(): void {
    this.loading = true;
    this.error = '';

    this.http.get<File[]>('/api/directory?path=' + this.directoryPath).subscribe(
      (data) => {
        this.directoryListing = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to fetch directory listing.';
        this.loading = false;
      }
    );
  }
}
