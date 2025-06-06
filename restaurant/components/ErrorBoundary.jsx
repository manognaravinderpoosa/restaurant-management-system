import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false, errorMessage: '', errorInfo: null };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log("Error captured:", error, info);
        this.setState({ errorMessage: error.toString(), errorInfo: info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "20px", backgroundColor: "lightcoral", color: "white", borderRadius: "5px" }}>
                    <h2>Something went wrong!</h2>
                    <p>{this.state.errorMessage}</p>
                    <details>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
