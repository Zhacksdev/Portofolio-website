import { Navigation } from '@/components/navigation'
import { Mail, Github, Linkedin, Twitter } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-8">
            Get In Touch
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            I'm always open to discussing new projects, creative ideas, or 
            opportunities to be part of your vision. Feel free to reach out 
            through any of the channels below.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-semibold mb-6">
                Contact Methods
              </h2>

              <div className="space-y-4">
                <a
                  href="mailto:hello@example.com"
                  className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 transition-colors group"
                >
                  <div className="h-12 w-12 bg-background flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-muted-foreground transition-colors">
                      Email
                    </p>
                    <p className="text-sm text-muted-foreground">
                      hello@example.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 transition-colors group"
                >
                  <div className="h-12 w-12 bg-background flex items-center justify-center">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-muted-foreground transition-colors">
                      GitHub
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @yourusername
                    </p>
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 transition-colors group"
                >
                  <div className="h-12 w-12 bg-background flex items-center justify-center">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-muted-foreground transition-colors">
                      LinkedIn
                    </p>
                    <p className="text-sm text-muted-foreground">
                      /in/yourusername
                    </p>
                  </div>
                </a>

                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 transition-colors group"
                >
                  <div className="h-12 w-12 bg-background flex items-center justify-center">
                    <Twitter className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-muted-foreground transition-colors">
                      Twitter
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @yourusername
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="pt-8">
              <h2 className="text-2xl font-display font-semibold mb-4">
                Response Time
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                I typically respond to emails within 24-48 hours during business days. 
                For urgent inquiries, feel free to reach out on LinkedIn or Twitter 
                for a faster response.
              </p>
            </div>
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
