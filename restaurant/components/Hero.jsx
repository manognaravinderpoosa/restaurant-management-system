import "./Hero.css";
function Hero() {
    return (
        <section class="features-section">
            <h2 class="features-title">Why Choose Our Digital Restaurant Ordering System?</h2>
            <div class="features-container">

                <div class="feature-box light-blue">
                    <h3>Reduce Waiter Cost</h3>
                    <p>Minimize the need for multiple waiters through automated ordering.</p>
                    <a href="#more1" class="more-arrow">→</a>
                </div>

                <div class="feature-box light-yellow">
                    <h3>Hassle-free Ordering & Payment</h3>
                    <p>Customers can easily order and pay via digital interface — quick & smooth.</p>
                    <a href="#more2" class="more-arrow">→</a>
                </div>

                <div class="feature-box light-green">
                    <h3>Overcome Language Barriers</h3>
                    <p>No miscommunication — customers place orders through visual menu.</p>
                    <a href="#more3" class="more-arrow">→</a>
                </div>

                <div class="feature-box light-pink">
                    <h3>Direct Customer to Kitchen</h3>
                    <p>Chef receives order directly — no middleman needed.</p>
                    <a href="#more4" class="more-arrow">→</a>
                </div>

                <div class="feature-box light-purple">
                    <h3>Eliminate Human Errors</h3>
                    <p>Accurate order tracking and billing without manual mistakes.</p>
                    <a href="#more5" class="more-arrow">→</a>
                </div>
                <div class="feature-box light-orange">
                    <h3>Smart Inventory Management</h3>
                    <p>Get instant warnings for low-stock items like rice, wheat, etc. to avoid delays.</p>
                    <a href="#more6" class="more-arrow">→</a>
                </div>

                <div class="feature-box light-teal">
                    <h3>Real-time Profit Monitoring</h3>
                    <p>Owners can track daily, weekly, and monthly profits — anytime, anywhere.</p>
                    <a href="#more7" class="more-arrow">→</a>
                </div>

            </div>
        </section>

    )
}
export default Hero;