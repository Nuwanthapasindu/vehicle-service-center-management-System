import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Reusable PDF Generator utility
 */
export const pdfGenerator = {
  /**
   * Generates and prints a PDF directly
   * @param {string} htmlContent - The HTML template content
   */
  print: async (htmlContent) => {
    try {
      if (!htmlContent) throw new Error("No content provided for PDF generation");
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error('PDF Generation Error (Print):', error);
      throw error;
    }
  },

  /**
   * Generates a PDF file and opens the share dialog
   * @param {string} htmlContent - The HTML template content
   * @param {string} fileName - Optional filename for the generated PDF
   */
  share: async (htmlContent, fileName = 'Document') => {
    try {
      if (!htmlContent) throw new Error("No content provided for PDF generation");
      
      const { uri } = await Print.printToFileAsync({ 
        html: htmlContent,
        base64: false 
      });

      await Sharing.shareAsync(uri, { 
        UTI: '.pdf', 
        mimeType: 'application/pdf',
        dialogTitle: `Share ${fileName}`
      });
      
      return uri;
    } catch (error) {
      console.error('PDF Generation Error (Share):', error);
      throw error;
    }
  }
};
