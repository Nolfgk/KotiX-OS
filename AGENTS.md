# KotiX-OS Development Guidelines

## Project Overview
KotiX-OS is a custom Debian-based Linux distribution with integrated AI/LLM support for developers. This repository contains the project website, assets, and configuration files.

## Build/Test Commands

### Static Website
- **Preview**: Open `index.html` directly in a browser
- **No build process required**: This is a static HTML/CSS website
- **Unit Testing**: Open `tests/test-runner.html` in browser to run unit tests

### Distribution Development
- **ISO Management**: Use Git LFS for ISO files (*.iso filter=lfs)
- **Package Management**: Standard Debian apt commands
- **LLM Testing**: `ollama serve && ollama run deepseek-r1:14b`

## Code Style Guidelines

### HTML/CSS Structure
- **File Organization**: 
  - `index.html` - Main landing page
  - `style.css` - Main stylesheet
  - `header.css` - Header-specific styles (currently empty)
- **HTML Validation**: Use proper DOCTYPE and semantic HTML5 elements
- **CSS Methodology**: Simple class-based styling, no preprocessors
- **Responsive Design**: Basic responsive considerations for different screen sizes

### Naming Conventions
- **Files**: kebab-case (e.g., `kotix-live-gnome-2025.04.md5`)
- **CSS Classes**: kebab-case (e.g., `.parallax`, `.container`)
- **HTML Elements**: Standard semantic HTML5 tags
- **Image Assets**: Descriptive names with resolution indicators (e.g., `kotix4k.png`)

### Asset Management
- **Images**: Organized by resolution in `images/` directory
  - `640x480/splash.png` - Low resolution
  - `800x600/splash.png` - High resolution
  - Main logos in root: `kotix.png`, `kotix4k.png`
- **ASCII Art**: Stored in `fastfetch/ascii-art.txt` and `images/ascii-art.txt`
- **SVG**: Use vector format for logos when possible (`distributor-logo.svg`)

### Configuration Files
- **JSONC**: Use JSON with Comments for configuration (fastfetch)
- **JSON**: Standard JSON for API configurations (opencode.json)
- **Schema Validation**: Include `$schema` references where applicable

### Git Workflow
- **Branch Strategy**: Main development on `main` branch
- **Commit Messages**: Conventional commits for distribution releases
- **LFS**: Use Git LFS for large binary files (ISO images)
- **Tags**: Version tags for releases (e.g., `25.04`)

### Documentation Standards
- **README.md**: Comprehensive project documentation with:
  - Project description
  - Installation instructions
  - Release notes (chronological)
  - Links to resources
- **Release Notes**: Format: `DD-MM-YYYY - version description`
  - Use bullet points for changes
  - Include base image updates
  - Track software additions/removals

### System Integration
- **Fastfetch Configuration**: Custom system info display in `fastfetch/config.jsonc`
  - Color scheme: Yellow, red, white, green, blue, magenta
  - Custom ASCII art branding
  - Structured module layout
- **Ollama Integration**: Default LLM model: `deepseek-r1:14b`
- **Desktop Environment**: GNOME (default)

### Error Handling
- **Website**: Graceful degradation for missing assets
- **Configuration**: Validate JSON schemas where possible
- **Distribution**: Standard Debian error handling

### Security Considerations
- **No Secrets**: Never commit API keys or credentials
- **Package Sources**: Use official Debian repositories
- **LLM Integration**: Local Ollama instance only (no external API keys)

### Performance Guidelines
- **Image Optimization**: Provide multiple resolutions
- **CSS Efficiency**: Avoid complex selectors
- **Loading**: Optimize for web delivery

### Code Quality
- **HTML**: Validate with W3C validator
- **CSS**: Keep styles simple and maintainable
- **JSON**: Use proper formatting and schema validation
- **Documentation**: Keep README current with each release

## Development Environment Setup
- **IDE**: IntelliJ IDEA (Java 21 configured but no Java source)
- **Browser Testing**: Test in Chromium (included in distribution)
- **Local Development**: Simple file server or direct browser opening
- **Version Control**: Git with GitHub integration

## Release Process
1. Update base Debian image
2. Update software packages
3. Modify package list (additions/removals)
4. Update fastfetch configuration if needed
5. Update README with release notes
6. Create new version tag
7. Update website with new download links

## File Structure Reference
```
KotiX-OS/
├── index.html              # Main website
├── style.css              # Main styles
├── README.md              # Project documentation
├── fastfetch/             # System customization
├── images/                # Project assets
├── opencode.json          # AI provider config
└── tests/                 # Unit tests
    ├── test-framework.js  # Simple test framework
    ├── rss-feed-tests.js  # RSS feed unit tests
    └── test-runner.html   # Test runner interface
```

## Testing Guidelines
- **Unit Tests**: Located in `tests/` directory
- **Test Runner**: Open `tests/test-runner.html` in browser to run all tests
- **Test Framework**: Simple custom JavaScript framework (no external dependencies)
- **RSS Feed Tests**: Comprehensive coverage of RSS parsing, error handling, and HTML generation
- **Manual Testing**: Verify RSS feed loads correctly on main website

## Notes for AI Agents
- This is primarily a Linux distribution project, not a traditional software development project
- Focus on documentation, asset management, and configuration
- Website is static HTML/CSS with minimal JavaScript for RSS feed functionality
- All changes should maintain the project's simplicity and focus on the Linux distribution
- When adding JavaScript features, include corresponding unit tests in the `tests/` directory