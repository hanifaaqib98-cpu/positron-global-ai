package com.example.positron.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Slate950 = Color(0xFF030712)
val Slate900 = Color(0xFF0F172A)
val Slate800 = Color(0xFF1E293B)
val Slate700 = Color(0xFF334155)
val Slate600 = Color(0xFF475569)
val Slate400 = Color(0xFF94A3B8)
val Slate300 = Color(0xFFCBD5E1)
val Slate100 = Color(0xFFF1F5F9)

val Sky500 = Color(0xFF0EA5E9)
val Sky400 = Color(0xFF38BDF8)
val Emerald400 = Color(0xFF34D399)
val Amber400 = Color(0xFFFBBF24)
val Red400 = Color(0xFFF87171)

private val DarkColorScheme = darkColorScheme(
    primary = Sky400,
    onPrimary = Slate950,
    primaryContainer = Color(0xFF0369A1),
    onPrimaryContainer = Slate100,
    secondary = Emerald400,
    onSecondary = Slate950,
    tertiary = Amber400,
    onTertiary = Slate950,
    background = Slate950,
    onBackground = Slate100,
    surface = Slate900,
    onSurface = Slate100,
    surfaceVariant = Slate800,
    onSurfaceVariant = Slate300,
    outline = Slate700,
    error = Red400,
    onError = Slate950
)

@Composable
fun PositronTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography(),
        content = content
    )
}
