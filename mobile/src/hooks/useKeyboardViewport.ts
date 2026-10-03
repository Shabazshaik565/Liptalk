import { useState, useEffect, useRef } from 'react';
import { Platform, Keyboard, Dimensions, ScaledSize } from 'react-native';

export interface KeyboardViewportState {
  viewportHeight: number;
  viewportOffsetTop: number;
  keyboardInset: number;
  isKeyboardVisible: boolean;
  isDesktop: boolean;
}

/**
 * High-performance hook to measure visual viewport dimensions, keyboard appearance,
 * and IME insets across Web (PWA / Mobile Safari / Chrome), iOS, Android, and Desktop.
 */
export function useKeyboardViewport(): KeyboardViewportState {
  const [state, setState] = useState<KeyboardViewportState>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const vv = window.visualViewport;
      const initialHeight = vv ? vv.height : window.innerHeight;
      const initialOffsetTop = vv ? vv.offsetTop : 0;
      const isDesktop = window.innerWidth >= 768 && !('ontouchstart' in window);
      return {
        viewportHeight: initialHeight,
        viewportOffsetTop: initialOffsetTop,
        keyboardInset: 0,
        isKeyboardVisible: false,
        isDesktop,
      };
    }

    const screen = Dimensions.get('window');
    return {
      viewportHeight: screen.height,
      viewportOffsetTop: 0,
      keyboardInset: 0,
      isKeyboardVisible: false,
      isDesktop: screen.width >= 768,
    };
  });

  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // ------------------------------------------------------------------------
    // WEB / PWA IMPLEMENTATION (Visual Viewport API + window resize)
    // ------------------------------------------------------------------------
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleVisualViewportChange = () => {
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
        }

        rafId.current = requestAnimationFrame(() => {
          const vv = window.visualViewport;
          const layoutHeight = window.innerHeight;
          const visualHeight = vv ? vv.height : layoutHeight;
          const offsetTop = vv ? vv.offsetTop : 0;
          const isDesktop = window.innerWidth >= 768 && !('ontouchstart' in window);

          // Calculate keyboard inset if visual viewport shrunk significantly
          // Threshold of 70px prevents false positives from browser URL bar expanding/contracting
          const rawDelta = Math.max(0, layoutHeight - visualHeight - offsetTop);
          const isKeyboard = !isDesktop && rawDelta > 70;
          const keyboardInset = isKeyboard ? rawDelta : 0;

          setState({
            viewportHeight: visualHeight,
            viewportOffsetTop: offsetTop,
            keyboardInset,
            isKeyboardVisible: isKeyboard,
            isDesktop,
          });
        });
      };

      const vv = window.visualViewport;
      if (vv) {
        vv.addEventListener('resize', handleVisualViewportChange);
        vv.addEventListener('scroll', handleVisualViewportChange);
      }
      window.addEventListener('resize', handleVisualViewportChange);
      window.addEventListener('orientationchange', handleVisualViewportChange);

      // Initial check
      handleVisualViewportChange();

      return () => {
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current);
        }
        if (vv) {
          vv.removeEventListener('resize', handleVisualViewportChange);
          vv.removeEventListener('scroll', handleVisualViewportChange);
        }
        window.removeEventListener('resize', handleVisualViewportChange);
        window.removeEventListener('orientationchange', handleVisualViewportChange);
      };
    }

    // ------------------------------------------------------------------------
    // NATIVE IOS & ANDROID IMPLEMENTATION (React Native Keyboard API)
    // ------------------------------------------------------------------------
    const onDimensionsChange = ({ window: win }: { window: ScaledSize }) => {
      setState((prev) => ({
        ...prev,
        viewportHeight: win.height,
        isDesktop: win.width >= 768,
      }));
    };

    const dimSub = Dimensions.addEventListener('change', onDimensionsChange);

    const handleKeyboardShow = (e: any) => {
      const keyboardHeight = e?.endCoordinates?.height ?? 0;
      if (keyboardHeight > 0) {
        setState((prev) => {
          if (prev.isKeyboardVisible && prev.keyboardInset === keyboardHeight) {
            return prev;
          }
          return {
            ...prev,
            keyboardInset: keyboardHeight,
            isKeyboardVisible: true,
          };
        });
      }
    };

    const handleKeyboardHide = () => {
      setState((prev) => {
        if (!prev.isKeyboardVisible && prev.keyboardInset === 0) {
          return prev;
        }
        return {
          ...prev,
          keyboardInset: 0,
          isKeyboardVisible: false,
        };
      });
    };

    const subscriptions: any[] = [];
    try {
      subscriptions.push(Keyboard.addListener('keyboardWillShow', handleKeyboardShow));
      subscriptions.push(Keyboard.addListener('keyboardDidShow', handleKeyboardShow));
      subscriptions.push(Keyboard.addListener('keyboardWillHide', handleKeyboardHide));
      subscriptions.push(Keyboard.addListener('keyboardDidHide', handleKeyboardHide));
    } catch (_) {}

    return () => {
      dimSub.remove();
      subscriptions.forEach((sub) => {
        try {
          sub?.remove?.();
        } catch (_) {}
      });
    };
  }, []);

  return state;
}
