import { enums } from '../constants/enum';

/**
 * Returns the CSS class corresponding to a jobcard status.
 * @param {string} status - The status value.
 * @returns {string} - The CSS class name.
 */
export const getStatusClass = (status) => {
    switch (status) {
        case enums.JOBCARD_STATUS.FINISH:
            return 'completed';
        case enums.JOBCARD_STATUS.START:
            return 'progress';
        case enums.JOBCARD_STATUS.PENDING:
            return 'pending';
        default:
            return '';
    }
};

/**
 * Returns the display text for a jobcard status.
 * @param {string} status - The status value.
 * @returns {string} - The human-readable status text.
 */
export const getStatusText = (status) => {
    switch (status) {
        case enums.JOBCARD_STATUS.FINISH:
            return 'COMPLETED';
        case enums.JOBCARD_STATUS.START:
            return 'IN PROGRESS';
        case enums.JOBCARD_STATUS.PENDING:
            return 'PENDING';
        default:
            return status || 'UNKNOWN';
    }
};
