import os
import re

provider_dir = 'src/app/test/media'
for root, dirs, files in os.walk(provider_dir):
    for file in files:
        if file == 'page.tsx':
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find function name from the directory name
            # Path: src/app/test/media/vimeo/page.tsx -> provider = vimeo
            provider_name = os.path.basename(os.path.dirname(path))
            # Capitalize first letter for the function name (e.g., VimeoPage)
            func_name = provider_name.capitalize() + "Page"
            
            # Replace "export default function ...Page()" with a valid function name
            # This regex looks for "export default function " followed by anything until "Page()"
            new_content = re.sub(r'export default function\s+[\w\s]+Page\(\)', f'export default function {func_name}()', content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {path} -> {func_name}")
