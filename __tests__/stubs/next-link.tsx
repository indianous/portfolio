// Substitui o `next/link` nos testes: marca o <a> para provar que a navegação passa pelo Next.js.
export default function Link({ href, children, ...rest }: React.ComponentProps<'a'>) {
  return (
    <a href={href} data-next-link="" {...rest}>
      {children}
    </a>
  )
}
