import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

interface GraphQLDataConnectorProps {
  query: string;
  variables?: Record<string, any>;
  dataPath?: string;
  render: (data: any, loading: boolean) => React.ReactNode;
}

const GraphQLDataConnector: React.FC<GraphQLDataConnectorProps> = ({ 
  query, 
  variables = {}, 
  dataPath, 
  render 
}) => {
  // GraphQL sorgusu oluştur
  const QUERY = gql`${query}`;
  
  // Sorguyu çalıştır
  const { loading, error, data } = useQuery(QUERY, {
    variables,
    skip: !query
  });
  
  // Belirtilen yoldan veriyi al
  const extractData = (data: any, path?: string): any => {
    if (!data || !path) return data;
    
    const keys = path.split('.');
    let result = data;
    
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return null;
      }
    }
    
    return result;
  };
  
  const extractedData = extractData(data, dataPath);
  
  if (error) {
    console.error("GraphQL error:", error);
    return <div>Hata: {error.message}</div>;
  }
  
  return <>{render(extractedData, loading)}</>;
};

export default GraphQLDataConnector;
