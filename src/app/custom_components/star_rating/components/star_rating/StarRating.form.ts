import nestedComponentForm from 'formiojs/components/_classes/nested/NestedComponent.form';
import StarRatingEditDisplay from './editForm/StarRating.edit.display';
export default function(...extend) {
  return nestedComponentForm([
    {
      key: 'display',
      components: StarRatingEditDisplay
    }
  ], ...extend);
}
