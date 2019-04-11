export default function(root, current) {
  const transform = `translate(${-100 * current.section}vw) translateY(${-100 * current.depth}vh)`;
  root.style.transform = transform;
}
