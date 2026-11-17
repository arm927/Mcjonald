
import { peso } from '../components/MenuCard.jsx';

export default function Cart({
  cart,
  menu,
  onUpdateQty,
  onRemove
}) {
  const lines = cart.map((line) => ({
    ...line,
    item: menu.find((m) => m.id === line.menuId),
  })).filter((line) => line.item);

  const total = lines.reduce(
    (sum, line) => sum + Number(line.item.price) * line.qty,
    0
  );

  const count = lines.reduce(
    (sum, line) => sum + line.qty,
    0
  );

  return (
    <section className="container page">

      {/* Header */}
      <div className="section-head">
        <div>
          <h1>Your Cart</h1>
          <p className="muted">
            {count} {count === 1 ? 'item' : 'items'} in your cart.
          </p>
        </div>

        <a className="btn btn-ghost" href="/menu">
          Continue shopping
        </a>
      </div>

      {/* Cart Items */}
      {lines.length > 0 ? (
        <>
          <div className="cart-list">

            {lines.map(({ menuId, qty, item }) => (
              <article className="card cart-item" key={menuId}>

                <div className="cart-art">
                  {({
                    Coffee: '☕',
                    'Non-Coffee': '🧋',
                    Pastry: '🥐',
                    Meals: '🥪'
                  })[item.category] || '☕'}
                </div>

                <div className="cart-info">

                  <div className="cart-item-head">
                    <div>
                      <h3>{item.name}</h3>
                      <span className="muted small">
                        {item.category}
                      </span>
                    </div>

                    <strong className="price">
                      {peso(item.price)}
                    </strong>
                  </div>

                  <p className="muted small">
                    {item.description}
                  </p>

                  <div className="cart-item-actions">

                    {/* Quantity Controls */}
                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQty(menuId, qty - 1)
                        }
                      >
                        −
                      </button>

                      <span>{qty}</span>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQty(menuId, qty + 1)
                        }
                      >
                        +
                      </button>

                    </div>

                    {/* Item Subtotal */}
                    <strong>
                      {peso(item.price * qty)}
                    </strong>

                    {/* Remove Item */}
                    <button
                      type="button"
                      className="btn btn-sm btn-danger-ghost"
                      onClick={() => onRemove(menuId)}
                    >
                      Remove
                    </button>

                  </div>
                </div>
              </article>
            ))}

          </div>

          {/* Order Summary */}
          <aside className="cart-summary">

            <div>
              <span>Subtotal</span>
              <strong>{peso(total)}</strong>
            </div>

            <div>
              <span>Total Items</span>
              <strong>{count}</strong>
            </div>

            <div className="cart-total">
              <span>Total</span>
              <strong>{peso(total)}</strong>
            </div>

            <p className="muted small">
              Review your items before proceeding.
            </p>

          </aside>
        </>
      ) : (

        /* Empty Cart */
        <div className="empty cart-empty">

          <div className="cart-empty-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything yet.
          </p>

          <a className="btn btn-primary" href="/menu">
            Browse the Menu
          </a>

        </div>

      )}

    </section>
  );
}
