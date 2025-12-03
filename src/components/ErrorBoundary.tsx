// File: src/components/ErrorBoundary.tsx

import React, { ReactNode } from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui';
import { spacing, typography, colors} from '@/theme';
import { EmptyState } from '@/components/EmptyState';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.light.background }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: spacing.lg,
            }}
          >
            <EmptyState
              icon="⚠️"
              title="Something went wrong"
              subtitle={this.state.error?.message || 'Please try again'}
            />
            <Button
              label="Try Again"
              onPress={() => this.setState({ hasError: false, error: null })}
              style={{ marginTop: spacing.lg, width: '100%' }}
            />
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}