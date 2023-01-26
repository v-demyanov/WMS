import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiEndpoints } from 'src/app/core/constants/api-endpoints.constants';
import { parseEnum } from 'src/app/core/helpers/enum.helper';
import { ODataValue } from 'src/app/core/models/odata-value';
import { ProblemStatus } from '../enums/problem-status.enum';
import { IProblem } from '../models/problem';
import { IRawProblem } from '../models/raw-problem';

@Injectable({
  providedIn: 'root',
})
export class ProblemsService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public getAll(): Observable<IProblem[]> {
    return this.http.get<ODataValue<IRawProblem>>(ApiEndpoints.Problems)
      .pipe(map((odataValue: ODataValue<IRawProblem>) => odataValue.value.map((x) => this.parseProblem(x))));
  }

  public get(problemId: number): Observable<IProblem> {
    const expandQuery: string = '$expand=TargetAddress($expand=Shelf($expand=VerticalSection($expand=Rack))&$expand=Area)';
    const filterQuery: string = `$filter=Id eq ${problemId}`;
    const odataQuery: string = `${filterQuery}&${expandQuery}`;

    return this.http.get<ODataValue<IRawProblem>>(`${ApiEndpoints.Problems}?${odataQuery}`)
      .pipe(map((odataValue: ODataValue<IRawProblem>) => this.parseProblem(odataValue.value[0])));
  }

  public updateStatus = (status: ProblemStatus, problemId: number): Observable<void> =>
    this.http.put<void>(`${ApiEndpoints.Problems}${problemId}/UpdateStatus`, status);

  public create = (problem: IProblem): Observable<IProblem> => 
    this.http.post<IRawProblem>(ApiEndpoints.Problems, problem)
      .pipe(map((problem: IRawProblem) => this.parseProblem(problem)));

  private parseProblem(rawProblem: IRawProblem): IProblem {
    return {
      ...rawProblem,
      Status: parseEnum(ProblemStatus, rawProblem.Status),
      CreatedDate: new Date(rawProblem.CreatedDate),
      LastUpdateDate: rawProblem.CreatedDate ? new Date(rawProblem.CreatedDate) : null,
    };
  }
}
