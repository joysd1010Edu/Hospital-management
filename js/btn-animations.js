document.addEventListener("DOMContentLoaded", function () {
  // Selector targets typical interactive elements
  const selector =
    'a[href], button, input[type="button"], input[type="submit"], .rounded-lg';
  const els = Array.from(document.querySelectorAll(selector));

  els.forEach((el) => {
    // Skip anchors without clickable behavior (like fragment-only links)
    if (
      el.tagName.toLowerCase() === "a" &&
      (!el.getAttribute("href") || el.getAttribute("href").startsWith("#"))
    )
      return;

    // Make element ready for ripple
    el.classList.add("clickable");

    el.addEventListener("click", function (e) {
      // Create ripple element
      const rect = el.getBoundingClientRect();
      const circle = document.createElement("span");
      circle.className = "ripple";
      const size = Math.max(rect.width, rect.height) * 1.2;
      circle.style.width = circle.style.height = size + "px";

      // Coordinates relative to the element
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      circle.style.left = x + "px";
      circle.style.top = y + "px";

      // For very dark backgrounds use a darker ripple
      try {
        const bg = window.getComputedStyle(el).backgroundColor || "";
        if (bg && (bg.indexOf("rgb(") === 0 || bg.indexOf("rgba(") === 0)) {
          // crude check for dark bg: parse first numeric value (red) and check brightness
          const nums = bg
            .replace(/rgba?\(|\)|\s/g, "")
            .split(",")
            .map(Number);
          const r = nums[0] || 0,
            g = nums[1] || 0,
            b = nums[2] || 0;
          const brightness = (r * 299 + g * 587 + b * 114) / 1000; // perceived brightness
          if (brightness < 80) {
            el.classList.add("dark-ripple");
          } else {
            el.classList.remove("dark-ripple");
          }
        }
      } catch (err) {
        // ignore
      }

      el.appendChild(circle);

      // Press animation
      el.classList.add("press");
      setTimeout(function () {
        el.classList.remove("press");
      }, 200);

      // Remove ripple after animation ends
      circle.addEventListener("animationend", function () {
        circle.remove();
      });

      // If the element is a link, do not block navigation. The ripple may be cut by navigation but still occurs.
    });

    // Support keyboard activation
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        el.classList.add("press");
        setTimeout(function () {
          el.classList.remove("press");
        }, 200);
      }
    });
  });
});
