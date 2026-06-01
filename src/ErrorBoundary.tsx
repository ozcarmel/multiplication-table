import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App render failed', error, info);
  }

  resetApp = () => {
    localStorage.removeItem('multiplication-progress');
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="recovery-screen" lang="he" dir="rtl">
        <section>
          <p>לוח הכפל</p>
          <h1>נטען מחדש ונמשיך ללמוד</h1>
          <p>
            מצאנו נתוני דפדפן ישנים או תקלה זמנית. אפשר לנקות את ההתקדמות המקומית
            ולפתוח את הלוח מחדש.
          </p>
          <button type="button" onClick={this.resetApp}>
            פתחו מחדש
          </button>
        </section>
      </main>
    );
  }
}
