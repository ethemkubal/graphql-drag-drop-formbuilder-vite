export interface Component {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  props: Record<string, any>;
  styles?: ComponentStyles;
  dataSource?: {
    type: string;
    query: string;
    variables: Record<string, any>;
    dataPath: string;
  };
  validation?: ValidationRules;
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  customValidator?: string; // Custom validation function as string
}

export interface ComponentStyles {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  opacity?: number;
  customCSS?: string; // Custom CSS as string
}

export interface DataConnection {
  id: string;
  endpoint: string;
  query: string;
  dataPath: string;
}

// Form önizleme tipi
export interface FormPreviewSettings {
  enabled: boolean; // Önizleme modu açık mı?
  responsive: boolean; // Duyarlı mod açık mı?
  device: 'desktop' | 'tablet' | 'mobile'; // Önizleme cihazı türü
  showValidation: boolean; // Doğrulama göster
  showPlaceholders: boolean; // Placeholder'ları göster
  darkMode: boolean; // Karanlık mod
}

// Form data - önizleme için
export interface FormData {
  [key: string]: any;
}
