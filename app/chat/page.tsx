import Chat from '@/components/chat';

export default async function ChatPage() {
  const chatid = crypto.randomUUID();

  const md = String.raw`
  Here are multiple complex LaTeX equations formatted in Markdown:

**1. Navier-Stokes Equations (Incompressible Flow)**

$$
\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} = -\frac{1}{\rho}\nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{f}
$$
$$
\nabla \cdot \mathbf{u} = 0
$$
where \( \mathbf{u} \) is the fluid velocity vector, \( t \) is time, \( \rho \) is the fluid density, \( p \) is the pressure, \( \nu \) is the kinematic viscosity, and \( \mathbf{f} \) is the body force per unit volume.

**2. Schrödinger Equation (Time-Dependent)**

$$
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \left[ -\frac{\hbar^2}{2m} \nabla^2 + V(\mathbf{r}, t) \right] \Psi(\mathbf{r}, t)
$$
where \( i \) is the imaginary unit, \( \hbar \) is the reduced Planck constant, \( \Psi(\mathbf{r}, t) \) is the wave function, \( m \) is the mass of the particle, \( \nabla^2 \) is the Laplacian operator, and \( V(\mathbf{r}, t) \) is the potential energy.

**3. Einstein Field Equations**

$$
R_{\mu\nu} - \frac{1}{2} g_{\mu\nu} R + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}
$$
where \( R_{\mu\nu} \) is the Ricci curvature tensor, \( g_{\mu\nu} \) is the metric tensor, \( R \) is the Ricci scalar, \( \Lambda \) is the cosmological constant, \( G \) is the gravitational constant, \( c \) is the speed of light, and \( T_{\mu\nu} \) is the stress-energy tensor.

**4. Maxwell's Equations (Differential Form)**

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}
$$
$$
\nabla \cdot \mathbf{B} = 0
$$
$$
\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}
$$
$$
\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}
$$
where \( \mathbf{E} \) is the electric field, \( \mathbf{B} \) is the magnetic field, \( \rho \) is the charge density, \( \epsilon_0 \) is the vacuum permittivity, \( \mu_0 \) is the vacuum permeability, and \( \mathbf{J} \) is the current density.

**5. Black-Scholes Equation**

$$
\frac{\partial C}{\partial t} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 C}{\partial S^2} + r S \frac{\partial C}{\partial S} - r C = 0
$$
where \( C \) is the option price, \( t \) is time, \( \sigma \) is the volatility of the underlying asset, \( S \) is the price of the underlying asset, and \( r \) is the risk-free interest rate.

**6. Heat Equation (with source term)**

$$
\frac{\partial u}{\partial t} - \alpha \nabla^2 u = f(\mathbf{r}, t)
$$
where \( u \) is the temperature, \( t \) is time, \( \alpha \) is the thermal diffusivity, \( \nabla^2 \) is the Laplacian operator, and \( f(\mathbf{r}, t) \) is the heat source term.

These examples cover various fields of science and finance, demonstrating the capability of LaTeX to represent complex mathematical expressions.
  `

  return <Chat chatid={chatid} initialMessages={[{ role: 'user', content: ' lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor sit amet consectetur adipiscing elit' },{ role: 'assistant', content: md }]} />;
}
