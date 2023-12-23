import React, { Component } from 'react';
import './errorBoundary.css'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleRefreshPage() {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className='error-boundary'>
                    <h1>Something went wrong.</h1>
                    <p>We have been notified and will work on fixing the issue.</p>
                    <button onClick={this.handleRefreshPage}>Refresh Page</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
