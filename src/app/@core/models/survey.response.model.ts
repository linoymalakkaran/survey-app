declare module SurveyResponseModule {
    export interface SurveyResponse {
        Id: string;
        CompanyName: string;
        UserName: string;
        Question: string;
        Answers: string;
        ResponseDate: Date;
        SurveyName: string;
        SurveyStartDate: string;
        SurveyEndDate: string;
    }
}

