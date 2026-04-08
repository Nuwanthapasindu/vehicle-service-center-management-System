import * as Yup from 'yup';

export const ReviewSchema = Yup.object().shape({
    rating: Yup.number()
        .min(1, 'Please select a star rating to rate your detail')
        .required('Rating is required'),
    comment: Yup.string()
});
