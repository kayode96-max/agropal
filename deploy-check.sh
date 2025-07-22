#!/bin/bash

echo "🔍 Agropal Deployment Check"
echo "============================"

# Check if build directory exists
if [ -d "public" ]; then
    echo "✅ Build directory exists: public"
    
    # Check if essential files exist
    if [ -f "public/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html missing"
        exit 1
    fi
    
    if [ -f "public/asset-manifest.json" ]; then
        echo "✅ asset-manifest.json found"
    else
        echo "❌ asset-manifest.json missing"
        exit 1
    fi
    
    if [ -d "public/static" ]; then
        echo "✅ static directory found"
        
        # Count JS and CSS files
        js_files=$(find public/static -name "*.js" | wc -l)
        css_files=$(find public/static -name "*.css" | wc -l)
        
        echo "📄 Found $js_files JS files and $css_files CSS files"
        
        if [ $js_files -gt 0 ] && [ $css_files -gt 0 ]; then
            echo "✅ Build appears complete"
        else
            echo "⚠️  Warning: Missing JS or CSS files"
        fi
    else
        echo "❌ static directory missing"
        exit 1
    fi
    
    # Check file sizes
    echo ""
    echo "📊 Build Summary:"
    echo "=================="
    ls -lah public/
    
    echo ""
    echo "🚀 Ready for deployment!"
    echo "   Output Directory: public"
    echo "   Framework: Create React App"
    
else
    echo "❌ Build directory not found: public"
    echo "   Run 'npm run build' first"
    exit 1
fi
