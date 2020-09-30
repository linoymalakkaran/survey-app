import nestedComponentForm from 'formiojs/components/_classes/nested/NestedComponent.form';
import HppinessSurveyEditDisplay from './editForm/HappinessSurvey.edit.display';
import HappinessFieldEditValidation from './editForm/HappinessSurvey.edit.validation';
export default function(...extend) {
  return nestedComponentForm([
    {
      key: 'display',
      components: HppinessSurveyEditDisplay
    },
    {
      key: 'validation',
      components: HappinessFieldEditValidation
    }
  ], ...extend);
}
