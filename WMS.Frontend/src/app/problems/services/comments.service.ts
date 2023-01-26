import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { ODataValue } from 'src/app/core/models/odata-value';
import { IComment } from '../models/comment';
import { IRawComment } from '../models/raw-comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public getAllByProblemId(id: number): Observable<IComment[]> {
    return this.http.get<ODataValue<IRawComment>>(`${ApiEndpoints.Comments}?$filter=ProblemId eq ${id}&$expand=Owner&$orderby=Id desc`)
      .pipe(map((odataValue: ODataValue<IRawComment>) => odataValue.value.map((x) => this.parseComment(x))));
  }

  public create = (comment: IComment): Observable<IComment> => 
    this.http.post<IRawComment>(ApiEndpoints.Comments, comment)
      .pipe(map((rawComment: IRawComment) => this.parseComment(rawComment)));

  private parseComment(rawComment: IRawComment): IComment {
    return {
      ...rawComment,
      CreatedDate: new Date(rawComment.CreatedDate),
    };
  }
}
