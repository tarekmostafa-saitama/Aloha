import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateMailBoxResponseModel, GetMailBoxMailsResponseModel, MailboxClient } from 'src/app/web-api-client';

@Injectable({
  providedIn: "root",
})
export class MailboxService {
  constructor(private mailboxClient: MailboxClient) {}

  public CreateMailBox(): Observable<CreateMailBoxResponseModel> {
    return this.mailboxClient.create();
  }
  public GetMailBoxMessages(
    token: string,
    name: string
  ): Observable<GetMailBoxMailsResponseModel> {
    return this.mailboxClient.getAllMessages(name, token);
  }
}
