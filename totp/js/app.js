function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

function stripSpaces(str) {
  return str.replace(/\s/g, '');
}

function truncateTo(str, digits) {
  if (str.length <= digits) {
    return str;
  }

  return str.slice(-digits);
}

new Vue({
  el: '#app',
  data: {
    secret_key: 'JBSWY3DPEHPK3PXP',
    digits: 6,
    period: 30,
    updatingIn: 0,
    token: null
  },

  mounted: function () {
    this.getKeyFromUrl();
    this.update();

    this.intervalHandle = setInterval(this.update, 1000);
  },

  destroyed: function () {
    clearInterval(this.intervalHandle);
  },

  computed: {
    totp: function () {
      return new OTPAuth.TOTP({
        algorithm: 'SHA1',
        digits: this.digits,
        period: this.period,
        secret: OTPAuth.Secret.fromB32(stripSpaces(this.secret_key)),
      });
    }
  },

  methods: {
    update: function () {
      let millis = new Date().getTime();
      this.updatingIn = this.period - (getCurrentSeconds() % this.period);
      this.token5b = truncateTo(this.totp.generate({timestamp: millis - this.period * 1000 * 5}), this.digits);
      this.token4b = truncateTo(this.totp.generate({timestamp: millis - this.period * 1000 * 4}), this.digits);
      this.token3b = truncateTo(this.totp.generate({timestamp: millis - this.period * 1000 * 3}), this.digits);
      this.token2b = truncateTo(this.totp.generate({timestamp: millis - this.period * 1000 * 2}), this.digits);
      this.token1b = truncateTo(this.totp.generate({timestamp: millis - this.period * 1000 * 1}), this.digits);
      this.token0b = truncateTo(this.totp.generate(), this.digits);
      this.token1f = truncateTo(this.totp.generate({timestamp: millis + this.period * 1000 * 1}), this.digits);
      this.token2f = truncateTo(this.totp.generate({timestamp: millis + this.period * 1000 * 2}), this.digits);
      this.token3f = truncateTo(this.totp.generate({timestamp: millis + this.period * 1000 * 3}), this.digits);
      this.token4f = truncateTo(this.totp.generate({timestamp: millis + this.period * 1000 * 4}), this.digits);
      this.token5f = truncateTo(this.totp.generate({timestamp: millis + this.period * 1000 * 5}), this.digits);
    },

    getKeyFromUrl: function () {
      const key = document.location.hash.replace(/[#\/]+/, '');

      if (key.length > 0) {
        this.secret_key = key;
      }
    },
  }
});
