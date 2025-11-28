"use{objects.map((product) => (
              <div
                key={product.id}
                className="bg-black/40 border border-green-500/30 rounded-xl p-6 hover:border-green-500 transition-all hover:scale-105"
              >
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain pixel-art"
                  />
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-3xl font-bold text-green-400 mb-3">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                <div className="mb-4 text-xs text-gray-500">
                  {product.items}
                </div>

                <ul className="space-y-1 mb-6 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {purchasedProducts.has(product.id) ? (
                  <button
                    onClick={() => handleDownload(product.id)}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold transition-all"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setSelectedPrice(product.price);
                      setSelectedName(product.name);
                      setPaymentMethod(null);
                      setPaymentSuccess(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold transition-all"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            ))}{/* Placeholder Objects */}
            {[
              { name: "Pixel Pistol", description: "Animated handgun with firing effects" },
              { name: "Energy Rifle", description: "Sci-fi laser rifle with muzzle flash" },
              { name: "Shotgun", description: "Close-range scatter weapon" },
              { name: "Treasure Chest", description: "Animated opening chest with loot" },
              { name: "Health Potion", description: "Healing item with glow effect" },
              { name: "Magic Staff", description: "Wizard staff with particle effects" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 rounded-full px-3 py-1 text-xs font-bold text-green-400">
                  Coming Soon
                </div>

                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl opacity-30">🎮</div>
                </div>

                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-3xl font-bold text-gray-500 mb-3 line-through">
                  $5.00
                </p>

                <p className="text-gray-500 text-sm mb-4">{item.description}</p>

                <button
                  disabled
                  className="w-full py-3 bg-gray-700 cursor-not-allowed rounded-lg font-bold opacity-50"
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-cyan-400">
            Tileset Maps
          </h2>
          <p className="text-center text-gray-400 mb-12">Complete tilesets for building game worlds</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Placeholder Maps */}
            {[
              { name: "Dungeon Tileset", description: "Dark stone dungeon with walls, floors, and decorations", size: "16x16 tiles" },
              { name: "Forest Tileset", description: "Natural forest terrain with trees, grass, and paths", size: "16x16 tiles" },
              { name: "Sci-Fi Spaceship", description: "Futuristic interior with metal panels and tech", size: "32x32 tiles" },
              { name: "Desert Wasteland", description: "Sand dunes, rocks, and arid terrain", size: "16x16 tiles" },
              { name: "Ice Cave", description: "Frozen cavern with ice walls and crystals", size: "16x16 tiles" },
              { name: "City Streets", description: "Urban environment with roads and buildings", size: "32x32 tiles" }
            ].map((map, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 rounded-full px-3 py-1 text-xs font-bold text-green-400">
                  Coming Soon
                </div>

                <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl opacity-30">🗺️</div>
                </div>

                <h3 className="text-xl font-bold mb-2">{map.name}</h3>
                <p className="text-3xl font-bold text-gray-500 mb-3 line-through">
                  $10.00
                </p>

                <p className="text-gray-500 text-sm mb-2">{map.description}</p>
                <p className="text-xs text-gray-600 mb-4">Tile size: {map.size}</p>

                <button
                  disabled
                  className="w-full py-3 bg-gray-700 cursor-not-allowed rounded-lg font-bold opacity-50"
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-500 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {paymentSuccess ? (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-400">Payment Successful!</h3>
                <p className="text-gray-400">
                  Thank you for your purchase of {selectedName}
                </p>
                <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                  <p className="text-sm text-gray-400 mb-2">Your purchase is complete!</p>

                  {downloadLink && (
                    <a
                      href={downloadLink}
                      download
                      className="block w-full py-3 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 rounded-lg font-bold text-center transition-all"
                    >
                      Download {selectedName}
                    </a>
                  )}

                  <p className="text-xs text-gray-500">
                    You can re-download this file anytime by connecting the same wallet and visiting this page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setPaymentMethod(null);
                    setPaymentSuccess(false);
                  }}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4">
                  {paymentMethod ? "Complete Payment" : "Choose Payment Method"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {selectedName} - ${selectedPrice.toFixed(2)}
                </p>

                {!paymentMethod ? (
                  <div className="space-y-4">
                    <button
                      disabled
                      className="w-full py-4 bg-gray-600 cursor-not-allowed rounded-lg font-bold transition-all flex items-center justify-center gap-2 opacity-50"
                    >
                      <span>💳</span>
                      <div className="flex flex-col items-center">
                        <span>Pay with PayPal</span>
                        <span className="text-xs text-gray-400">Coming Soon</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("crypto")}
                      className="w-full py-4 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>🔐</span>
                      Pay with EVM Chains
                    </button>


                    <button
                      onClick={() => setPaymentMethod("solana")}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>👻</span>
                      <div className="flex flex-col items-center">
                        <span>Pay with Solana</span>
                        <span className="text-xs">SOL via Phantom</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("bitcoin")}
                      className="w-full py-4 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>₿</span>
                      <div className="flex flex-col items-center">
                        <span>Pay with Bitcoin</span>
                        <span className="text-xs">BTC Manual Payment</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setPaymentMethod(null);
                      }}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethod === "paypal" ? (
                      <PayPalPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        onSuccess={() => setPaymentSuccess(true)}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : paymentMethod === "crypto" ? (
                      <CryptoPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        productId={selectedProduct || ""}
                        onSuccess={() => {
                          setPaymentSuccess(true);
                          if (typeof window !== "undefined" && window.ethereum) {
                            window.ethereum.request({ method: 'eth_accounts' })
                              .then((accounts: string[]) => {
                                if (accounts[0]) {
                                  setDownloadLink(`/api/download?wallet=${accounts[0]}&productId=${selectedProduct}`);
                                }
                              });
                          }
                        }}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : paymentMethod === "solana" ? (
                      <SolanaPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        productId={selectedProduct || ""}
                        onSuccess={() => {
                          setPaymentSuccess(true);
                          if (typeof window !== "undefined" && window.solana) {
                            setDownloadLink(`/api/download?wallet=${window.solana.publicKey.toString()}&productId=${selectedProduct}`);
                          }
                        }}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : paymentMethod === "bitcoin" ? (
                      <BitcoinPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        productId={selectedProduct || ""}
                        onSuccess={() => {
                          setPaymentSuccess(true);
                          setDownloadLink(`/api/download?wallet=bitcoin&productId=${selectedProduct}`);
                        }}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : null}

                    <button
                      onClick={() => setPaymentMethod(null)}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                    >
                      ← Back to Payment Methods
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/50 border-t border-cyan-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2024 FoxHole's Pixel Characters and Maps Marketplace. All characters include commercial license.</p>
          <p className="mt-2 text-sm">Instant download • Crypto & PayPal accepted</p>
        </div>
      </footer>
    </div>
  );
}
