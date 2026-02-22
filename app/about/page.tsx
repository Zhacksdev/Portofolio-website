import { Navigation } from '@/components/navigation'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-8">
            About Me
          </h1>

          <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              I'm a frontend developer passionate about creating beautiful, 
              functional web experiences. With a focus on modern technologies 
              and clean design principles, I help bring ideas to life through code.
            </p>

            <h2 className="text-2xl font-display font-semibold mt-12 mb-4">
              Skills & Expertise
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-3">Frontend Development</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Responsive Design</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Tools & Workflow</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Git & GitHub</li>
                  <li>Figma</li>
                  <li>Vercel</li>
                  <li>Supabase</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold mt-12 mb-4">
              Experience
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              I've worked on a variety of projects ranging from small business 
              websites to complex web applications. My approach combines technical 
              expertise with a keen eye for design, ensuring that every project 
              is both functional and visually appealing.
            </p>

            <h2 className="text-2xl font-display font-semibold mt-12 mb-4">
              Let's Work Together
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I'm always interested in hearing about new projects and opportunities. 
              Feel free to reach out if you'd like to collaborate or just have a chat 
              about web development.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
