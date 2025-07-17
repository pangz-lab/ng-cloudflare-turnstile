import { Component, input, signal, type WritableSignal } from '@angular/core';

@Component({
  selector: 'app-clipboard',
  standalone: true,
  imports: [],
  templateUrl: './clipboard.component.html',
  styleUrl: './clipboard.component.css'
})
export class ClipboardComponent {
    readonly data = input<string>();
    isConfigCopied: WritableSignal<boolean> = signal(false);
    async configToClipboard(): Promise<void> {
        await navigator.clipboard.writeText(this.data() ?? '');
        this.isConfigCopied.set(true);
        setTimeout(() => {
            this.isConfigCopied.set(false);
        }, 1000)
    }
}
