import React from 'react';
import { provideHooks } from 'redial';

export default function (callback) {
  return ComposedComponent => {
    class FetchDataEnhancer extends ComposedComponent {
      render() {
        return (
          <ComposedComponent { ...this.props } />
        );
      }
    }

    return provideHooks({
      fetchData(...args) {
        return callback(...args);
      },
    })(FetchDataEnhancer);
  };
}
